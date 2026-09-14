const DonorProfile = require('../models/DonorProfile');
const BloodBank = require('../models/BloodBank');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { createNotification } = require('../services/notificationService');

const withoutIncompleteLocation = (payload) => {
  const cleanedPayload = { ...payload };
  const coordinates = cleanedPayload.location?.coordinates;

  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    delete cleanedPayload.location;
  }

  return cleanedPayload;
};

const canManageDonor = (req, profile) =>
  profile.user.toString() === req.user.id || ['admin', 'coordinator'].includes(req.user.role);

const requireVerifiedBank = async (req) => {
  if (req.user.role !== 'bank') {
    throw new AppError('Only an approved blood bank can manage donor approvals', 403);
  }

  const bank = await BloodBank.findOne({
    user: req.user.id,
    verificationStatus: 'approved',
    status: 'active'
  }).select('_id');

  if (!bank) {
    throw new AppError('Your blood bank must be approved and active before managing donors', 403);
  }
};

const parseNearbyQuery = (req) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusKm = Number(req.query.radiusKm || 25);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return {
    $nearSphere: {
      $geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      $maxDistance: radiusKm * 1000
    }
  };
};

exports.createDonor = asyncHandler(async (req, res) => {
  const existingProfile = await DonorProfile.findOne({ user: req.user.id }).lean();
  if (existingProfile) {
    throw new AppError('Donor profile already exists for this user', 409);
  }

  const donor = await DonorProfile.create({
    ...withoutIncompleteLocation(req.body),
    user: req.user.id,
    isEligible: req.body.isEligible !== false,
    approvalStatus: 'pending'
  });

  await createNotification({
    user: req.user.id,
    type: 'approval',
    title: 'Donor profile submitted',
    message: 'Your donor profile was created and is awaiting blood bank review.',
    resourceType: 'DonorProfile',
    resourceId: donor._id
  });

  const populatedDonor = await donor.populate('user', 'name email role phone');

  res.status(201).json({
    success: true,
    message: 'Donor profile created successfully',
    data: populatedDonor
  });
});

exports.listDonors = asyncHandler(async (req, res) => {
  const {
    bloodType,
    city,
    status,
    isEligible,
    availability,
    approvalStatus,
    nearbyOnly,
    page = 1,
    limit = 20
  } = req.query;

  const query = {};

  if (bloodType) query.bloodType = bloodType;
  if (city) query.city = { $regex: city, $options: 'i' };
  if (status) query.status = status;
  if (availability) query.availability = availability;
  if (approvalStatus) query.approvalStatus = approvalStatus;
  if (isEligible !== undefined) query.isEligible = isEligible === 'true';

  if (!req.user || !['admin', 'coordinator', 'bank'].includes(req.user.role)) {
    query.status = query.status || 'active';
    query.approvalStatus = query.approvalStatus || 'approved';
    query.isEligible = query.isEligible !== undefined ? query.isEligible : true;
    query.availability = query.availability || { $in: ['available', 'on_call'] };
  }

  const nearbyQuery = parseNearbyQuery(req);
  if (nearbyOnly === 'true' && nearbyQuery) {
    query.location = nearbyQuery;
  }

  const pageNumber = Number(page);
  const limitNumber = Math.min(Number(limit), 50);
  const skip = (pageNumber - 1) * limitNumber;

  const [donors, total] = await Promise.all([
    DonorProfile.find(query)
      .select('-__v')
      .populate('user', 'name email role phone')
      .sort(nearbyQuery ? undefined : { createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    DonorProfile.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: donors.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    data: donors
  });
});

exports.getMyDonorProfile = asyncHandler(async (req, res) => {
  const profile = await DonorProfile.findOne({ user: req.user.id })
    .populate('user', 'name email role phone')
    .lean();

  if (!profile) {
    throw new AppError('No donor profile found for this user', 404);
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

exports.getDonorById = asyncHandler(async (req, res) => {
  const donor = await DonorProfile.findById(req.params.id)
    .populate('user', 'name email role phone')
    .lean();

  if (!donor) {
    throw new AppError('Donor profile not found', 404);
  }

  res.status(200).json({
    success: true,
    data: donor
  });
});

exports.updateDonor = asyncHandler(async (req, res) => {
  const donor = await DonorProfile.findById(req.params.id);
  if (!donor) {
    throw new AppError('Donor profile not found', 404);
  }

  if (!canManageDonor(req, donor)) {
    throw new AppError('Not authorized to update this donor profile', 403);
  }

  const updatePayload = withoutIncompleteLocation(req.body);
  delete updatePayload.approvalStatus;
  delete updatePayload.rejectionReason;
  delete updatePayload.approvedBy;
  delete updatePayload.approvedAt;

  const updatedDonor = await DonorProfile.findByIdAndUpdate(req.params.id, updatePayload, {
    new: true,
    runValidators: true
  }).populate('user', 'name email role phone');

  res.status(200).json({
    success: true,
    message: 'Donor profile updated successfully',
    data: updatedDonor
  });
});

exports.updateAvailability = asyncHandler(async (req, res) => {
  const { availability, status } = req.body;
  const donor = await DonorProfile.findOne({ user: req.user.id });

  if (!donor) {
    throw new AppError('Donor profile not found', 404);
  }

  if (availability) donor.availability = availability;
  if (status) donor.status = status;
  await donor.save();

  res.status(200).json({
    success: true,
    message: 'Availability updated successfully',
    data: donor
  });
});

exports.approveDonor = asyncHandler(async (req, res) => {
  await requireVerifiedBank(req);

  const { approvalStatus, rejectionReason } = req.body;
  const donor = await DonorProfile.findById(req.params.id);

  if (!donor) {
    throw new AppError('Donor profile not found', 404);
  }

  donor.approvalStatus = approvalStatus;
  donor.rejectionReason = approvalStatus === 'rejected' ? rejectionReason || '' : '';
  donor.approvedBy = req.user.id;
  donor.approvedAt = approvalStatus === 'approved' ? new Date() : undefined;
  await donor.save();

  await createNotification({
    user: donor.user,
    type: 'approval',
    title: approvalStatus === 'approved' ? 'Donor profile approved' : 'Donor profile review update',
    message:
      approvalStatus === 'approved'
        ? 'Your donor profile has been approved and is now searchable.'
        : `Your donor profile was ${approvalStatus}.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
    resourceType: 'DonorProfile',
    resourceId: donor._id,
    sendEmail: true
  });

  res.status(200).json({
    success: true,
    message: `Donor profile ${approvalStatus} successfully`,
    data: donor
  });
});

exports.deleteDonor = asyncHandler(async (req, res) => {
  const donor = await DonorProfile.findById(req.params.id);
  if (!donor) {
    throw new AppError('Donor profile not found', 404);
  }

  if (!canManageDonor(req, donor)) {
    throw new AppError('Not authorized to delete this donor profile', 403);
  }

  await donor.deleteOne();
  res.status(204).send();
});

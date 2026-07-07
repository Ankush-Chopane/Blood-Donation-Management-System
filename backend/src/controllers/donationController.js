const DonationHistory = require('../models/DonationHistory');
const DonorProfile = require('../models/DonorProfile');
const Inventory = require('../models/Inventory');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { createNotification } = require('../services/notificationService');

const canManageDonation = (req, donation) =>
  donation.donor.toString() === req.user.id || ['admin', 'coordinator', 'bank'].includes(req.user.role);

exports.createDonation = asyncHandler(async (req, res) => {
  const donorProfile = req.body.donorProfile
    ? await DonorProfile.findById(req.body.donorProfile)
    : await DonorProfile.findOne({ user: req.body.donor || req.user.id });

  const donation = await DonationHistory.create({
    ...req.body,
    donor: req.body.donor || req.user.id,
    donorProfile: donorProfile?._id
  });

  const populatedDonation = await donation.populate([
    { path: 'donor', select: 'name email role' },
    { path: 'donorProfile', select: 'bloodType city contactNumber totalDonations' },
    { path: 'bloodBank', select: 'name city contactNumber' },
    { path: 'inventoryItem', select: 'bloodType component units status' },
    { path: 'verifiedBy', select: 'name email role' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Donation record created successfully',
    data: populatedDonation
  });
});

exports.listDonations = asyncHandler(async (req, res) => {
  const { donor, bloodBank, status, bloodType, page = 1, limit = 20 } = req.query;
  const query = {};

  if (req.user.role === 'donor') {
    query.donor = req.user.id;
  } else if (donor) {
    query.donor = donor;
  }
  if (bloodBank) query.bloodBank = bloodBank;
  if (status) query.status = status;
  if (bloodType) query.bloodType = bloodType;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [donations, total] = await Promise.all([
    DonationHistory.find(query)
      .populate('donor', 'name email role')
      .populate('donorProfile', 'bloodType city contactNumber totalDonations')
      .populate('bloodBank', 'name city contactNumber')
      .populate('inventoryItem', 'bloodType component units status')
      .populate('verifiedBy', 'name email role')
      .sort({ donationDate: -1 })
      .skip(skip)
      .limit(limitNumber),
    DonationHistory.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: donations.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    data: donations
  });
});

exports.getDonationById = asyncHandler(async (req, res) => {
  const donation = await DonationHistory.findById(req.params.id)
    .populate('donor', 'name email role')
    .populate('donorProfile', 'bloodType city contactNumber totalDonations')
    .populate('bloodBank', 'name city contactNumber')
    .populate('inventoryItem', 'bloodType component units status')
    .populate('verifiedBy', 'name email role');

  if (!donation) {
    throw new AppError('Donation record not found', 404);
  }

  res.status(200).json({
    success: true,
    data: donation
  });
});

exports.updateDonation = asyncHandler(async (req, res) => {
  const donation = await DonationHistory.findById(req.params.id);
  if (!donation) {
    throw new AppError('Donation record not found', 404);
  }

  if (!canManageDonation(req, donation)) {
    throw new AppError('Not authorized to update this donation record', 403);
  }

  const previousStatus = donation.status;
  Object.assign(donation, req.body);

  if (req.body.status === 'approved' && previousStatus !== 'approved') {
    donation.verifiedBy = req.user.id;
    donation.approvedAt = new Date();

    if (donation.donorProfile) {
      await DonorProfile.findByIdAndUpdate(donation.donorProfile, {
        $inc: { totalDonations: 1 },
        lastDonationDate: donation.donationDate,
        nextEligibleDate: new Date(donation.donationDate.getTime() + 90 * 24 * 60 * 60 * 1000),
        isEligible: false
      });
    }

    if (donation.inventoryItem) {
      await Inventory.findByIdAndUpdate(donation.inventoryItem, {
        status: 'available'
      });
    }

    await createNotification({
      user: donation.donor,
      type: 'donation',
      title: 'Donation approved',
      message: 'Your donation record has been approved.',
      resourceType: 'DonationHistory',
      resourceId: donation._id,
      sendEmail: true
    });
  }

  await donation.save();

  const updatedDonation = await DonationHistory.findById(req.params.id)
    .populate('donor', 'name email role')
    .populate('donorProfile', 'bloodType city contactNumber totalDonations')
    .populate('bloodBank', 'name city contactNumber')
    .populate('inventoryItem', 'bloodType component units status')
    .populate('verifiedBy', 'name email role');

  res.status(200).json({
    success: true,
    message: 'Donation record updated successfully',
    data: updatedDonation
  });
});

exports.deleteDonation = asyncHandler(async (req, res) => {
  const donation = await DonationHistory.findById(req.params.id);
  if (!donation) {
    throw new AppError('Donation record not found', 404);
  }

  if (!canManageDonation(req, donation)) {
    throw new AppError('Not authorized to delete this donation record', 403);
  }

  await donation.deleteOne();
  res.status(204).send();
});

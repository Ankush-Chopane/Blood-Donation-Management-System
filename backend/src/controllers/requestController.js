const BloodRequest = require('../models/BloodRequest');
const BloodBank = require('../models/BloodBank');
const Inventory = require('../models/Inventory');
const DonorProfile = require('../models/DonorProfile');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { createNotification } = require('../services/notificationService');
const { buildStatusHistoryEntry, createRequestCode } = require('../utils/requestHelpers');

const canManageRequest = (req, request) => {
  if (req.user.role === 'bank') return true;
  return req.user.role === 'recipient'
    && request.requestedBy.toString() === req.user.id
    && Object.keys(req.body).every((key) => ['status', 'note'].includes(key))
    && req.body.status === 'cancelled';
};

const requireVerifiedBank = async (req) => {
  const bank = await BloodBank.findOne({
    user: req.user.id,
    verificationStatus: 'approved',
    status: 'active'
  }).select('_id');

  if (!bank) {
    throw new AppError('Your blood bank must be approved and active before managing requests', 403);
  }
};

const populateRequestQuery = (query) =>
  query
    .populate('requestedBy', 'name email role')
    .populate('recipient', 'bloodType city contactNumber hospitalName')
    .populate('assignedBloodBank', 'name city contactNumber');

exports.createRequest = asyncHandler(async (req, res) => {
  if (!req.body.neededBy) {
    throw new AppError('Please select a date for the blood request', 400);
  }

  const requestedDate = new Date(req.body.neededBy);
  if (Number.isNaN(requestedDate.getTime())) {
    throw new AppError('Please provide a valid needed-by date', 400);
  }

  const indiaToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  if (requestedDate.toISOString().slice(0, 10) < indiaToday) {
    throw new AppError('The needed-by date cannot be in the past for India time', 400);
  }

  const requestPayload = {
    ...req.body,
    ...(req.file ? { documentProofUrl: `/uploads/${req.file.filename}` } : {}),
    requestedBy: req.user.id,
    requestCode: createRequestCode(),
    verificationStatus: 'pending',
    status: 'pending',
    isEmergency: req.body.isEmergency === true || req.body.urgency === 'critical',
    statusHistory: [
      buildStatusHistoryEntry({
        status: 'pending',
        note: req.body.notes || 'Request created and awaiting verification',
        userId: req.user.id
      })
    ]
  };

  const request = await BloodRequest.create({
    ...requestPayload
  });

  const availableStock = await Inventory.aggregate([
    {
      $match: {
        bloodType: request.bloodTypeNeeded,
        status: 'available',
        expiryDate: { $gt: new Date() }
      }
    },
    {
      $group: {
        _id: '$bloodBank',
        availableUnits: { $sum: '$units' }
      }
    },
    {
      $match: { availableUnits: { $gte: request.unitsNeeded } }
    }
  ]);

  const stockByBank = new Map(availableStock.map((stock) => [String(stock._id), stock.availableUnits]));
  const eligibleBanks = await BloodBank.find({
    _id: { $in: availableStock.map((stock) => stock._id) },
    verificationStatus: 'approved',
    status: 'active'
  }).select('name city user');

  eligibleBanks.sort((first, second) => {
    const firstIsLocal = first.city?.toLowerCase() === request.city?.toLowerCase();
    const secondIsLocal = second.city?.toLowerCase() === request.city?.toLowerCase();
    return Number(secondIsLocal) - Number(firstIsLocal);
  });

  await Promise.all(
    eligibleBanks
      .filter((bank) => bank.user)
      .map((bank) => createNotification({
        user: bank.user,
        type: 'request',
        title: request.isEmergency ? 'Emergency blood request available' : 'New blood request available',
        message: `${request.bloodTypeNeeded} request for ${request.unitsNeeded} unit(s) at ${request.hospitalName}, ${request.city}. Your bank has ${stockByBank.get(String(bank._id))} available unit(s). Review and accept it in Verify Requests.`,
        resourceType: 'BloodRequest',
        resourceId: request._id,
        sendEmail: request.isEmergency
      }))
  );

  const populatedRequest = await populateRequestQuery(BloodRequest.findById(request._id));

  res.status(201).json({
    success: true,
    message: 'Blood request created successfully',
    data: populatedRequest
  });
});

exports.listRequests = asyncHandler(async (req, res) => {
  const {
    status,
    urgency,
    bloodTypeNeeded,
    city,
    requestedBy,
    assignedBloodBank,
    isEmergency,
    verificationStatus,
    page = 1,
    limit = 20
  } = req.query;

  const query = {};

  if (status) query.status = status;
  if (urgency) query.urgency = urgency;
  if (bloodTypeNeeded) query.bloodTypeNeeded = bloodTypeNeeded;
  if (city) query.city = { $regex: city, $options: 'i' };
  if (requestedBy) query.requestedBy = requestedBy;
  if (assignedBloodBank) query.assignedBloodBank = assignedBloodBank;
  if (isEmergency !== undefined) query.isEmergency = isEmergency === 'true';
  if (verificationStatus) query.verificationStatus = verificationStatus;

  const pageNumber = Number(page);
  const limitNumber = Math.min(Number(limit), 50);
  const skip = (pageNumber - 1) * limitNumber;

  if (req.user && !['admin', 'coordinator', 'bank'].includes(req.user.role)) {
    if (req.user.role === 'recipient') {
      query.requestedBy = req.user.id;
    } else if (req.user.role !== 'bank') {
      query.verificationStatus = 'approved';
      query.status = query.status || 'pending';
    }
  }

  const [requests, total] = await Promise.all([
    populateRequestQuery(
      BloodRequest.find(query)
        .select('-__v')
        .sort({ isEmergency: -1, lastStatusUpdatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
    ).lean(),
    BloodRequest.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: requests.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    data: requests
  });
});

exports.getRequestById = asyncHandler(async (req, res) => {
  const request = await populateRequestQuery(BloodRequest.findById(req.params.id)).lean();

  if (!request) {
    throw new AppError('Blood request not found', 404);
  }

  res.status(200).json({
    success: true,
    data: request
  });
});

exports.getRequestStatus = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findById(req.params.id)
    .select('requestCode status urgency isEmergency unitsNeeded unitsFulfilled statusHistory updatedAt lastStatusUpdatedAt')
    .lean();

  if (!request) {
    throw new AppError('Blood request not found', 404);
  }

  res.status(200).json({
    success: true,
    data: request
  });
});

exports.updateRequest = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findById(req.params.id);
  if (!request) {
    throw new AppError('Blood request not found', 404);
  }

  if (!canManageRequest(req, request)) {
    throw new AppError('Not authorized to update this blood request', 403);
  }

  if (req.user.role === 'recipient') {
    if (!['pending', 'matched'].includes(request.status)) {
      throw new AppError('Only open blood requests can be cancelled', 400);
    }
    request.status = 'cancelled';
    request.lastStatusUpdatedAt = new Date();
    request.statusHistory.push(
      buildStatusHistoryEntry({
        status: 'cancelled',
        note: req.body.note || 'Request cancelled by recipient',
        userId: req.user.id
      })
    );
    await request.save();
    return res.status(200).json({ success: true, message: 'Blood request cancelled successfully', data: request });
  }

  await requireVerifiedBank(req);

  const { status, note, unitsFulfilled, verificationStatus, rejectionReason, ...rest } = req.body;
  Object.assign(request, rest);

  if (verificationStatus && ['pending', 'approved', 'rejected'].includes(verificationStatus)) {
    request.verificationStatus = verificationStatus;
    request.verifiedBy = req.user.id;
    request.verifiedAt = new Date();

    if (verificationStatus === 'rejected') {
      request.rejectionReason = rejectionReason || 'Request did not pass facility verification.';
      request.status = 'cancelled';
    } else {
      request.rejectionReason = '';
      request.status = request.status || 'pending';
    }
  }

  if (unitsFulfilled !== undefined) {
    const nextUnitsFulfilled = Number(unitsFulfilled);
    if (!Number.isInteger(nextUnitsFulfilled) || nextUnitsFulfilled < 0 || nextUnitsFulfilled > request.unitsNeeded) {
      throw new AppError('Fulfilled units must be between zero and the requested quantity', 400);
    }
    request.unitsFulfilled = nextUnitsFulfilled;
  }

  if (status && status !== request.status) {
    request.status = status;
    request.lastStatusUpdatedAt = new Date();
    request.statusHistory.push(
      buildStatusHistoryEntry({
        status,
        note: note || `Status changed to ${status}`,
        userId: req.user.id
      })
    );

    await createNotification({
      user: request.requestedBy,
      type: 'request',
      title: `Request ${request.requestCode || ''} status updated`,
      message: `Your blood request is now ${status}.`,
      resourceType: 'BloodRequest',
      resourceId: request._id,
      sendEmail: ['matched', 'fulfilled'].includes(status)
    });
  }

  await request.save();

  if (verificationStatus === 'approved') {
    const nearbyDonors = await DonorProfile.find({
      bloodType: request.bloodTypeNeeded,
      city: { $regex: `^${request.city}$`, $options: 'i' },
      isEligible: true,
      availability: { $in: ['available', 'on_call'] },
      approvalStatus: 'approved',
      status: 'active'
    })
      .select('user')
      .limit(request.isEmergency ? 25 : 10)
      .lean();

    await Promise.all(
      nearbyDonors.map((donor) =>
        createNotification({
          user: donor.user,
          type: 'request',
          title: request.isEmergency ? 'Emergency blood request nearby' : 'New blood request nearby',
          message: `${request.bloodTypeNeeded} needed in ${request.city} for ${request.recipientName}.`,
          resourceType: 'BloodRequest',
          resourceId: request._id,
          sendEmail: request.isEmergency
        })
      )
    );
  }

  const updatedRequest = await populateRequestQuery(BloodRequest.findById(req.params.id));

  res.status(200).json({
    success: true,
    message: 'Blood request updated successfully',
    data: updatedRequest
  });
});

exports.deleteRequest = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findById(req.params.id);
  if (!request) {
    throw new AppError('Blood request not found', 404);
  }

  if (!canManageRequest(req, request)) {
    throw new AppError('Not authorized to delete this blood request', 403);
  }

  await request.deleteOne();
  res.status(204).send();
});

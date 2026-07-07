const BloodRequest = require('../models/BloodRequest');
const DonorProfile = require('../models/DonorProfile');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { createNotification } = require('../services/notificationService');
const { buildStatusHistoryEntry, createRequestCode } = require('../utils/requestHelpers');

const canManageRequest = (req, request) =>
  request.requestedBy.toString() === req.user.id || ['admin', 'coordinator', 'bank'].includes(req.user.role);

const populateRequestQuery = (query) =>
  query
    .populate('requestedBy', 'name email role')
    .populate('recipient', 'bloodType city contactNumber hospitalName')
    .populate('assignedBloodBank', 'name city contactNumber');

exports.createRequest = asyncHandler(async (req, res) => {
  const request = await BloodRequest.create({
    ...req.body,
    requestedBy: req.user.id,
    requestCode: createRequestCode(),
    isEmergency: req.body.isEmergency === true || req.body.urgency === 'critical',
    statusHistory: [
      buildStatusHistoryEntry({
        status: 'pending',
        note: req.body.notes || 'Request created',
        userId: req.user.id
      })
    ]
  });

  const nearbyDonors = await DonorProfile.find({
    bloodType: req.body.bloodTypeNeeded,
    city: { $regex: `^${req.body.city}$`, $options: 'i' },
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

  const pageNumber = Number(page);
  const limitNumber = Math.min(Number(limit), 50);
  const skip = (pageNumber - 1) * limitNumber;

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

  const { status, note, unitsFulfilled, ...rest } = req.body;
  Object.assign(request, rest);

  if (unitsFulfilled !== undefined) {
    request.unitsFulfilled = unitsFulfilled;
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

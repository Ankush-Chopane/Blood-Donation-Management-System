const BloodBank = require('../models/BloodBank');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { createNotification } = require('../services/notificationService');

const canManageBank = (req, bank) =>
  ['admin', 'coordinator'].includes(req.user.role) || (bank.user && bank.user.toString() === req.user.id);

exports.createBloodBank = asyncHandler(async (req, res) => {
  const ownerId = req.body.user || req.user.id;
  const existingBank = await BloodBank.findOne({ user: ownerId });
  if (existingBank) {
    throw new AppError('A blood bank application already exists for this account', 409);
  }

  const bank = await BloodBank.create({
    ...req.body,
    user: ownerId,
    verificationStatus: 'pending',
    status: 'inactive'
  });

  const admins = await User.find({ role: 'admin', status: 'active' }).select('_id');
  await Promise.all(
    admins.map((admin) => createNotification({
      user: admin._id,
      type: 'approval',
      title: 'New blood bank application',
      message: `${bank.name} submitted a blood bank profile for verification.`,
      resourceType: 'BloodBank',
      resourceId: bank._id
    }))
  );

  res.status(201).json({
    success: true,
    message: 'Blood bank created successfully',
    data: bank
  });
});

exports.listBloodBanks = asyncHandler(async (req, res) => {
  const { city, status, verificationStatus, page = 1, limit = 20 } = req.query;
  const query = {};

  if (city) query.city = { $regex: city, $options: 'i' };
  if (status) query.status = status;
  if (verificationStatus) query.verificationStatus = verificationStatus;

  if (!req.user || !['admin', 'coordinator'].includes(req.user.role)) {
    if (req.user?.role === 'bank') {
      query.$or = [
        { user: req.user.id },
        { verificationStatus: 'approved', status: 'active' }
      ];
    } else {
      query.verificationStatus = 'approved';
      query.status = 'active';
    }
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [banks, total] = await Promise.all([
    BloodBank.find(query)
      .populate('user', 'name email role phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),
    BloodBank.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: banks.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    data: banks
  });
});

exports.listAllBloodBanksForAdmin = asyncHandler(async (req, res) => {
  const banks = await BloodBank.find({})
    .populate('user', 'name email role phone')
    .sort({ createdAt: -1 })
    .limit(200);

  res.status(200).json({
    success: true,
    count: banks.length,
    total: banks.length,
    data: banks
  });
});

exports.getMyBloodBank = asyncHandler(async (req, res) => {
  const bank = await BloodBank.findOne({ user: req.user.id })
    .populate('user', 'name email role phone');

  if (!bank) {
    throw new AppError('No blood bank profile found for this account', 404);
  }

  res.status(200).json({
    success: true,
    data: bank
  });
});

exports.getBloodBankById = asyncHandler(async (req, res) => {
  const bank = await BloodBank.findById(req.params.id).populate('user', 'name email role phone');
  if (!bank) {
    throw new AppError('Blood bank not found', 404);
  }

  res.status(200).json({
    success: true,
    data: bank
  });
});

exports.updateBloodBank = asyncHandler(async (req, res) => {
  const bank = await BloodBank.findById(req.params.id);
  if (!bank) {
    throw new AppError('Blood bank not found', 404);
  }

  if (!canManageBank(req, bank)) {
    throw new AppError('Not authorized to update this blood bank', 403);
  }

  const updatePayload = { ...req.body };
  if (req.user.role !== 'admin') {
    delete updatePayload.verificationStatus;
    delete updatePayload.status;
    delete updatePayload.approvedBy;
    delete updatePayload.verifiedAt;
  }

  if (req.user.role === 'bank' && bank.verificationStatus === 'rejected') {
    updatePayload.verificationStatus = 'pending';
    updatePayload.status = 'inactive';
    updatePayload.rejectionReason = '';
  }

  const updatedBank = await BloodBank.findByIdAndUpdate(req.params.id, updatePayload, {
    new: true,
    runValidators: true
  }).populate('user', 'name email role phone');

  res.status(200).json({
    success: true,
    message: 'Blood bank updated successfully',
    data: updatedBank
  });
});

exports.deleteBloodBank = asyncHandler(async (req, res) => {
  const bank = await BloodBank.findById(req.params.id);
  if (!bank) {
    throw new AppError('Blood bank not found', 404);
  }

  if (!canManageBank(req, bank)) {
    throw new AppError('Not authorized to delete this blood bank', 403);
  }

  await bank.deleteOne();
  res.status(204).send();
});

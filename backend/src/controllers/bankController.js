const BloodBank = require('../models/BloodBank');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const canManageBank = (req, bank) =>
  ['admin', 'coordinator'].includes(req.user.role) || (bank.user && bank.user.toString() === req.user.id);

exports.createBloodBank = asyncHandler(async (req, res) => {
  const bank = await BloodBank.create({
    ...req.body,
    user: req.body.user || req.user.id
  });

  res.status(201).json({
    success: true,
    message: 'Blood bank created successfully',
    data: bank
  });
});

exports.listBloodBanks = asyncHandler(async (req, res) => {
  const { city, status, page = 1, limit = 20 } = req.query;
  const query = {};

  if (city) query.city = { $regex: city, $options: 'i' };
  if (status) query.status = status;

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

  const updatedBank = await BloodBank.findByIdAndUpdate(req.params.id, req.body, {
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

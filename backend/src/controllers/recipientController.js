const RecipientProfile = require('../models/RecipientProfile');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const canManageRecipient = (req, profile) =>
  profile.user.toString() === req.user.id || ['admin', 'coordinator'].includes(req.user.role);

exports.createRecipient = asyncHandler(async (req, res) => {
  const existingProfile = await RecipientProfile.findOne({ user: req.user.id });
  if (existingProfile) {
    throw new AppError('Recipient profile already exists for this user', 409);
  }

  const recipient = await RecipientProfile.create({
    ...req.body,
    user: req.user.id
  });

  const populatedRecipient = await recipient.populate('user', 'name email role phone');

  res.status(201).json({
    success: true,
    message: 'Recipient profile created successfully',
    data: populatedRecipient
  });
});

exports.listRecipients = asyncHandler(async (req, res) => {
  const { bloodType, city, page = 1, limit = 20 } = req.query;
  const query = {};

  if (bloodType) query.bloodType = bloodType;
  if (city) query.city = { $regex: city, $options: 'i' };

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [recipients, total] = await Promise.all([
    RecipientProfile.find(query)
      .populate('user', 'name email role phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),
    RecipientProfile.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: recipients.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    data: recipients
  });
});

exports.getMyRecipientProfile = asyncHandler(async (req, res) => {
  const profile = await RecipientProfile.findOne({ user: req.user.id }).populate('user', 'name email role phone');
  if (!profile) {
    throw new AppError('No recipient profile found for this user', 404);
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

exports.getRecipientById = asyncHandler(async (req, res) => {
  const recipient = await RecipientProfile.findById(req.params.id).populate('user', 'name email role phone');
  if (!recipient) {
    throw new AppError('Recipient profile not found', 404);
  }

  res.status(200).json({
    success: true,
    data: recipient
  });
});

exports.updateRecipient = asyncHandler(async (req, res) => {
  const recipient = await RecipientProfile.findById(req.params.id);
  if (!recipient) {
    throw new AppError('Recipient profile not found', 404);
  }

  if (!canManageRecipient(req, recipient)) {
    throw new AppError('Not authorized to update this recipient profile', 403);
  }

  const updatedRecipient = await RecipientProfile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('user', 'name email role phone');

  res.status(200).json({
    success: true,
    message: 'Recipient profile updated successfully',
    data: updatedRecipient
  });
});

exports.deleteRecipient = asyncHandler(async (req, res) => {
  const recipient = await RecipientProfile.findById(req.params.id);
  if (!recipient) {
    throw new AppError('Recipient profile not found', 404);
  }

  if (!canManageRecipient(req, recipient)) {
    throw new AppError('Not authorized to delete this recipient profile', 403);
  }

  await recipient.deleteOne();
  res.status(204).send();
});

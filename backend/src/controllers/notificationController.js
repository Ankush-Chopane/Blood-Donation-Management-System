const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const canManageNotification = (req, notification) =>
  notification.user.toString() === req.user.id || ['admin', 'coordinator'].includes(req.user.role);

exports.createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: notification
  });
});

exports.listNotifications = asyncHandler(async (req, res) => {
  const { user, isRead, type, page = 1, limit = 20 } = req.query;
  const query = {};

  if (['admin', 'coordinator'].includes(req.user.role)) {
    if (user) query.user = user;
  } else {
    query.user = req.user.id;
  }

  if (isRead !== undefined) query.isRead = isRead === 'true';
  if (type) query.type = type;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),
    Notification.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    data: notifications
  });
});

exports.getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id).populate('user', 'name email role');
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (!canManageNotification(req, notification)) {
    throw new AppError('Not authorized to view this notification', 403);
  }

  res.status(200).json({
    success: true,
    data: notification
  });
});

exports.updateNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (!canManageNotification(req, notification)) {
    throw new AppError('Not authorized to update this notification', 403);
  }

  const updates = { ...req.body };
  if (updates.isRead === true && !updates.readAt) {
    updates.readAt = new Date();
    updates.deliveryStatus = 'read';
  }

  const updatedNotification = await Notification.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  }).populate('user', 'name email role');

  res.status(200).json({
    success: true,
    message: 'Notification updated successfully',
    data: updatedNotification
  });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  const filter = ['admin', 'coordinator'].includes(req.user.role) && req.body.user
    ? { user: req.body.user }
    : { user: req.user.id };

  await Notification.updateMany(
    { ...filter, isRead: false },
    {
      isRead: true,
      readAt: new Date(),
      deliveryStatus: 'read'
    }
  );

  res.status(200).json({
    success: true,
    message: 'Notifications marked as read'
  });
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (!canManageNotification(req, notification)) {
    throw new AppError('Not authorized to delete this notification', 403);
  }

  await notification.deleteOne();
  res.status(204).send();
});

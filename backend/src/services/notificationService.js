const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendGenericEmail } = require('./mailService');

const createNotification = async ({
  user,
  type = 'info',
  title,
  message,
  resourceType = null,
  resourceId = null,
  sendEmail = false
}) => {
  const notification = await Notification.create({
    user,
    type,
    title,
    message,
    resourceType,
    resourceId,
    deliveryStatus: sendEmail ? 'queued' : 'sent'
  });

  if (sendEmail) {
    const targetUser = await User.findById(user).select('email name');

    if (targetUser?.email) {
      await sendGenericEmail({
        to: targetUser.email,
        subject: title || 'BloodConnect Notification',
        html: `<p>Hello ${targetUser.name || 'there'},</p><p>${message}</p>`,
        text: message
      });
      notification.deliveryStatus = 'sent';
      await notification.save();
    }
  }

  return notification;
};

module.exports = { createNotification };

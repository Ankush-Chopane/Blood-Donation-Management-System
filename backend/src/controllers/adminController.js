const BloodBank = require('../models/BloodBank');
const BloodRequest = require('../models/BloodRequest');
const DonationHistory = require('../models/DonationHistory');
const DonorProfile = require('../models/DonorProfile');
const Inventory = require('../models/Inventory');
const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');
const RecipientProfile = require('../models/RecipientProfile');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const [
    users,
    donors,
    recipients,
    bloodBanks,
    pendingRequests,
    totalRequests,
    availableInventory,
    unreadNotifications,
    pendingDonorApprovals,
    pendingAppointments,
    recentDonations
  ] = await Promise.all([
    User.countDocuments(),
    DonorProfile.countDocuments(),
    RecipientProfile.countDocuments(),
    BloodBank.countDocuments(),
    BloodRequest.countDocuments({ status: { $in: ['pending', 'matched'] } }),
    BloodRequest.countDocuments(),
    Inventory.aggregate([
      { $match: { status: { $in: ['available', 'reserved'] } } },
      { $group: { _id: null, totalUnits: { $sum: '$units' } } }
    ]),
    Notification.countDocuments({ isRead: false }),
    DonorProfile.countDocuments({ approvalStatus: 'pending' }),
    Appointment.countDocuments({ status: 'pending' }),
    DonationHistory.find()
      .populate('donor', 'name email')
      .populate('bloodBank', 'name city')
      .sort({ donationDate: -1 })
      .limit(5)
  ]);

  const inventoryByType = await Inventory.aggregate([
    { $match: { status: { $in: ['available', 'reserved'] } } },
    { $group: { _id: '$bloodType', totalUnits: { $sum: '$units' } } },
    { $sort: { _id: 1 } }
  ]);

  const requestsByStatus = await BloodRequest.aggregate([
    { $group: { _id: '$status', total: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totals: {
        users,
        donors,
        recipients,
        bloodBanks,
        requests: totalRequests,
        pendingRequests,
        availableInventoryUnits: availableInventory[0]?.totalUnits || 0,
        unreadNotifications,
        pendingDonorApprovals,
        pendingAppointments
      },
      inventoryByType,
      requestsByStatus,
      recentDonations
    }
  });
});

exports.getDashboardActivity = asyncHandler(async (req, res) => {
  const [latestRequests, latestNotifications, latestUsers] = await Promise.all([
    BloodRequest.find()
      .populate('requestedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(10),
    Notification.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(10),
    User.find()
      .select('name email role status createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
  ]);

  res.status(200).json({
    success: true,
    data: {
      latestRequests,
      latestNotifications,
      latestUsers
    }
  });
});

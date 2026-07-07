const BloodBank = require('../models/BloodBank');
const Inventory = require('../models/Inventory');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const canManageInventory = async (req, inventory) => {
  if (['admin', 'coordinator'].includes(req.user.role)) {
    return true;
  }

  const bank = await BloodBank.findById(inventory.bloodBank).select('user');
  return bank && bank.user && bank.user.toString() === req.user.id;
};

const syncBankInventorySummary = async (bloodBankId) => {
  const summary = await Inventory.aggregate([
    {
      $match: {
        bloodBank: bloodBankId,
        status: { $in: ['available', 'reserved'] }
      }
    },
    {
      $group: {
        _id: '$bloodType',
        totalUnits: { $sum: '$units' }
      }
    }
  ]);

  const inventoryUpdate = {
    'inventory.O+': 0,
    'inventory.O-': 0,
    'inventory.A+': 0,
    'inventory.A-': 0,
    'inventory.B+': 0,
    'inventory.B-': 0,
    'inventory.AB+': 0,
    'inventory.AB-': 0
  };

  summary.forEach((item) => {
    inventoryUpdate[`inventory.${item._id}`] = item.totalUnits;
  });

  await BloodBank.findByIdAndUpdate(bloodBankId, inventoryUpdate);
};

exports.createInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.create(req.body);
  await syncBankInventorySummary(inventory.bloodBank);

  const populatedInventory = await inventory.populate([
    { path: 'bloodBank', select: 'name city contactNumber' },
    { path: 'sourceDonation', select: 'bloodType unitsDonated donationDate status' },
    { path: 'reservedFor', select: 'recipientName bloodTypeNeeded urgency status' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Inventory record created successfully',
    data: populatedInventory
  });
});

exports.listInventory = asyncHandler(async (req, res) => {
  const { bloodBank, bloodType, status, component, expiresBefore, page = 1, limit = 20 } = req.query;
  const query = {};

  if (bloodBank) query.bloodBank = bloodBank;
  if (bloodType) query.bloodType = bloodType;
  if (status) query.status = status;
  if (component) query.component = component;
  if (expiresBefore) query.expiryDate = { $lte: new Date(expiresBefore) };

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [items, total] = await Promise.all([
    Inventory.find(query)
      .populate('bloodBank', 'name city contactNumber')
      .populate('sourceDonation', 'bloodType unitsDonated donationDate status')
      .populate('reservedFor', 'recipientName bloodTypeNeeded urgency status')
      .sort({ expiryDate: 1 })
      .skip(skip)
      .limit(limitNumber),
    Inventory.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: items.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    data: items
  });
});

exports.getInventorySummary = asyncHandler(async (req, res) => {
  const match = {};

  if (req.query.bloodBank) {
    match.bloodBank = req.query.bloodBank;
  }

  const [summary, lowStock, expiringSoon] = await Promise.all([
    Inventory.aggregate([
      { $match: match },
      {
        $group: {
          _id: { bloodType: '$bloodType', status: '$status' },
          units: { $sum: '$units' }
        }
      },
      { $sort: { '_id.bloodType': 1 } }
    ]),
    Inventory.find({
      ...match,
      status: 'available',
      units: { $lte: 5 }
    })
      .select('bloodBank bloodType units batchNumber')
      .limit(10)
      .lean(),
    Inventory.find({
      ...match,
      status: { $in: ['available', 'reserved'] },
      expiryDate: { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }
    })
      .select('bloodBank bloodType units expiryDate batchNumber')
      .sort({ expiryDate: 1 })
      .limit(10)
      .lean()
  ]);

  res.status(200).json({
    success: true,
    data: {
      summary,
      lowStock,
      expiringSoon
    }
  });
});

exports.getInventoryById = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id)
    .populate('bloodBank', 'name city contactNumber')
    .populate('sourceDonation', 'bloodType unitsDonated donationDate status')
    .populate('reservedFor', 'recipientName bloodTypeNeeded urgency status');

  if (!item) {
    throw new AppError('Inventory record not found', 404);
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

exports.updateInventory = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) {
    throw new AppError('Inventory record not found', 404);
  }

  if (!(await canManageInventory(req, item))) {
    throw new AppError('Not authorized to update this inventory record', 403);
  }

  const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .populate('bloodBank', 'name city contactNumber')
    .populate('sourceDonation', 'bloodType unitsDonated donationDate status')
    .populate('reservedFor', 'recipientName bloodTypeNeeded urgency status');

  await syncBankInventorySummary(updatedItem.bloodBank._id);

  res.status(200).json({
    success: true,
    message: 'Inventory record updated successfully',
    data: updatedItem
  });
});

exports.deleteInventory = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) {
    throw new AppError('Inventory record not found', 404);
  }

  if (!(await canManageInventory(req, item))) {
    throw new AppError('Not authorized to delete this inventory record', 403);
  }

  const bankId = item.bloodBank;
  await item.deleteOne();
  await syncBankInventorySummary(bankId);

  res.status(204).send();
});

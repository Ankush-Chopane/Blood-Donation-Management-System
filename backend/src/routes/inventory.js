const express = require('express');
const {
  createInventory,
  listInventory,
  getInventorySummary,
  getInventoryById,
  updateInventory,
  deleteInventory
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', protect, authorize('admin', 'coordinator', 'bank'), getInventorySummary);

router
  .route('/')
  .get(protect, listInventory)
  .post(protect, authorize('admin', 'coordinator', 'bank'), createInventory);

router
  .route('/:id')
  .get(protect, getInventoryById)
  .put(protect, authorize('admin', 'coordinator', 'bank'), updateInventory)
  .delete(protect, authorize('admin', 'coordinator', 'bank'), deleteInventory);

module.exports = router;

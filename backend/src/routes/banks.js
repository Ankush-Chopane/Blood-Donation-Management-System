const express = require('express');
const {
  createBloodBank,
  listBloodBanks,
  getBloodBankById,
  updateBloodBank,
  deleteBloodBank
} = require('../controllers/bankController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(listBloodBanks)
  .post(protect, authorize('admin', 'coordinator', 'bank'), createBloodBank);

router
  .route('/:id')
  .get(getBloodBankById)
  .put(protect, authorize('admin', 'coordinator', 'bank'), updateBloodBank)
  .delete(protect, authorize('admin', 'coordinator', 'bank'), deleteBloodBank);

module.exports = router;

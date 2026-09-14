const express = require('express');
const {
  createBloodBank,
  listBloodBanks,
  listAllBloodBanksForAdmin,
  getMyBloodBank,
  getBloodBankById,
  updateBloodBank,
  deleteBloodBank
} = require('../controllers/bankController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/mine', protect, authorize('bank'), getMyBloodBank);
router.get('/admin/all', protect, authorize('admin'), listAllBloodBanksForAdmin);

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

const express = require('express');
const {
  createDonor,
  listDonors,
  getMyDonorProfile,
  getDonorById,
  updateDonor,
  updateAvailability,
  approveDonor,
  deleteDonor
} = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/me').get(protect, getMyDonorProfile);
router.patch('/me/availability', protect, authorize('donor', 'admin', 'coordinator'), updateAvailability);
router.patch('/:id/approval', protect, authorize('bank'), approveDonor);

router
  .route('/')
  .get(protect, listDonors)
  .post(protect, authorize('donor', 'admin', 'coordinator'), createDonor);

router
  .route('/:id')
  .get(getDonorById)
  .put(protect, updateDonor)
  .delete(protect, deleteDonor);

module.exports = router;

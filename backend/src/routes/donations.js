const express = require('express');
const {
  createDonation,
  listDonations,
  getDonationById,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, listDonations)
  .post(protect, authorize('donor', 'admin', 'coordinator', 'bank'), createDonation);

router
  .route('/:id')
  .get(protect, getDonationById)
  .put(protect, updateDonation)
  .delete(protect, deleteDonation);

module.exports = router;

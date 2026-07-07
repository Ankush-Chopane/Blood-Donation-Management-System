const express = require('express');
const { getDashboardSummary, getDashboardActivity } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin', 'coordinator'));

router.get('/dashboard', getDashboardSummary);
router.get('/dashboard/activity', getDashboardActivity);

module.exports = router;

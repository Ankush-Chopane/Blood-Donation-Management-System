const express = require('express');
const {
  createRequest,
  listRequests,
  getRequestById,
  getRequestStatus,
  updateRequest,
  deleteRequest
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(listRequests)
  .post(protect, authorize('recipient', 'admin', 'coordinator', 'donor'), createRequest);

router
  .route('/:id')
  .get(getRequestById)
  .put(protect, updateRequest)
  .delete(protect, deleteRequest);

router.get('/:id/status', protect, getRequestStatus);

module.exports = router;

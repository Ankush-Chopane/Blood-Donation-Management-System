const express = require('express');
const {
  createAppointment,
  listAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, listAppointments)
  .post(protect, authorize('donor', 'admin', 'coordinator'), createAppointment);

router
  .route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

module.exports = router;

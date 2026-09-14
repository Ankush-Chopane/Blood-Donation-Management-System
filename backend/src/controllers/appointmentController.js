const Appointment = require('../models/Appointment');
const BloodBank = require('../models/BloodBank');
const DonorProfile = require('../models/DonorProfile');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const { createNotification } = require('../services/notificationService');

const canManageAppointment = async (req, appointment) => {
  if (appointment.donor.toString() === req.user.id || ['admin', 'coordinator'].includes(req.user.role)) {
    return true;
  }

  if (req.user.role === 'bank') {
    const bank = await BloodBank.findById(appointment.bloodBank).select('user');
    return bank?.user?.toString() === req.user.id;
  }

  return false;
};

exports.createAppointment = asyncHandler(async (req, res) => {
  const donorProfile = await DonorProfile.findOne({ user: req.user.id });
  if (!donorProfile) {
    throw new AppError('Donor profile is required before booking an appointment', 400);
  }
  if (donorProfile.approvalStatus !== 'approved') {
    throw new AppError('Your donor profile must be approved before booking an appointment', 403);
  }
  const donorEligibilityWindowPassed = !donorProfile.nextEligibleDate || new Date(donorProfile.nextEligibleDate) <= new Date();
  const donorIsEligibleNow = donorProfile.isEligible !== false && donorEligibilityWindowPassed && donorProfile.availability !== 'unavailable';

  if (!donorIsEligibleNow) {
    const nextDate = donorProfile.nextEligibleDate ? new Date(donorProfile.nextEligibleDate).toLocaleDateString() : 'soon';
    throw new AppError(`You are currently not eligible for booking. Next eligible date: ${nextDate}`, 400);
  }

  const appointment = await Appointment.create({
    ...req.body,
    donor: req.user.id,
    donorProfile: donorProfile._id
  });

  await createNotification({
    user: req.user.id,
    type: 'appointment',
    title: 'Appointment requested',
    message: 'Your donation appointment request has been submitted.',
    resourceType: 'Appointment',
    resourceId: appointment._id,
    sendEmail: true
  });

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('donor', 'name email role')
    .populate('donorProfile', 'bloodType city availability')
    .populate('bloodBank', 'name city contactNumber');

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
    data: populatedAppointment
  });
});

exports.listAppointments = asyncHandler(async (req, res) => {
  const { status, bloodBank, donor, page = 1, limit = 20 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (bloodBank) query.bloodBank = bloodBank;
  if (donor) query.donor = donor;
  if (req.user.role === 'donor') query.donor = req.user.id;

  const pageNumber = Number(page);
  const limitNumber = Math.min(Number(limit), 50);
  const skip = (pageNumber - 1) * limitNumber;

  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate('donor', 'name email role')
      .populate('donorProfile', 'bloodType city availability')
      .populate('bloodBank', 'name city contactNumber')
      .sort({ appointmentDate: 1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    Appointment.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: appointments.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    data: appointments
  });
});

exports.getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('donor', 'name email role')
    .populate('donorProfile', 'bloodType city availability')
    .populate('bloodBank', 'name city contactNumber');

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (!(await canManageAppointment(req, appointment))) {
    throw new AppError('Not authorized to view this appointment', 403);
  }

  res.status(200).json({
    success: true,
    data: appointment
  });
});

exports.updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (!(await canManageAppointment(req, appointment))) {
    throw new AppError('Not authorized to update this appointment', 403);
  }

  if (req.user.role !== 'bank') {
    throw new AppError('Only the assigned blood bank can manage this appointment', 403);
  }

  const assignedBank = await BloodBank.findOne({
    _id: appointment.bloodBank,
    user: req.user.id,
    verificationStatus: 'approved',
    status: 'active'
  }).select('_id');

  if (!assignedBank) {
    throw new AppError('Only the approved assigned blood bank can manage this appointment', 403);
  }

  const previousStatus = appointment.status;
  Object.assign(appointment, req.body);

  if (req.body.status && req.body.status !== previousStatus) {
    if (req.body.status === 'approved') {
      appointment.approvedBy = req.user.id;
      appointment.approvedAt = new Date();
    }

    await createNotification({
      user: appointment.donor,
      type: 'appointment',
      title: 'Appointment status updated',
      message: `Your appointment is now ${req.body.status}.`,
      resourceType: 'Appointment',
      resourceId: appointment._id,
      sendEmail: true
    });
  }

  await appointment.save();

  const updatedAppointment = await Appointment.findById(req.params.id)
    .populate('donor', 'name email role')
    .populate('donorProfile', 'bloodType city availability')
    .populate('bloodBank', 'name city contactNumber');

  res.status(200).json({
    success: true,
    message: 'Appointment updated successfully',
    data: updatedAppointment
  });
});

exports.deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (!(await canManageAppointment(req, appointment))) {
    throw new AppError('Not authorized to delete this appointment', 403);
  }

  if (['admin', 'coordinator'].includes(req.user.role)) {
    throw new AppError('Admins cannot manage donor appointments', 403);
  }

  await appointment.deleteOne();

  res.status(204).send();
});

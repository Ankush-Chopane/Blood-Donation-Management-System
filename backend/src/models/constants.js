const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const USER_ROLES = ['donor', 'recipient', 'bank', 'admin', 'coordinator'];

const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;
const PIN_CODE_REGEX = /^[1-9][0-9]{5}$/;
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

module.exports = {
  BLOOD_TYPES,
  USER_ROLES,
  PHONE_REGEX,
  PIN_CODE_REGEX,
  EMAIL_REGEX
};

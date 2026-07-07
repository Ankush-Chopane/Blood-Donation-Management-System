const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const USER_ROLES = ['donor', 'recipient', 'bank', 'admin', 'coordinator'];

const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;
const ZIP_CODE_REGEX = /^[A-Za-z0-9 -]{3,12}$/;
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

module.exports = {
  BLOOD_TYPES,
  USER_ROLES,
  PHONE_REGEX,
  ZIP_CODE_REGEX,
  EMAIL_REGEX
};

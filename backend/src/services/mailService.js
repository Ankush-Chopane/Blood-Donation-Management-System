const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendVerificationEmail = async (email, name, token) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"BloodConnect Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your BloodConnect Account',
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for registering at BloodConnect. Please verify your account by clicking the link below:</p>
      <a href="${url}" style="background-color: #EF233C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Verify Account</a>
    `
  };

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } else {
      console.log(`Mock SMTP: Verification link is: ${url}`);
    }
  } catch (error) {
    console.error('Mail sending failed:', error.message);
  }
};

const sendResetEmail = async (email, name, token) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${token}`;
  
  const mailOptions = {
    from: `"BloodConnect Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your BloodConnect Password',
    html: `
      <h2>Hello ${name},</h2>
      <p>You requested to reset your password. Please click the link below to complete the reset process:</p>
      <a href="${url}" style="background-color: #EF233C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
      <p>If you did not request this, you can safely ignore this email.</p>
    `
  };

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`Reset email sent to ${email}`);
    } else {
      console.log(`Mock SMTP: Reset link is: ${url}`);
    }
  } catch (error) {
    console.error('Mail sending failed:', error.message);
  }
};

const sendGenericEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: `"BloodConnect Support" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text
  };

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } else {
      console.log(`Mock SMTP: ${subject} => ${to}`);
    }
  } catch (error) {
    console.error('Mail sending failed:', error.message);
  }
};

module.exports = { sendVerificationEmail, sendResetEmail, sendGenericEmail };

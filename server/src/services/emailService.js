const transporter = require('../config/mailer');
const env = require('../config/env');
const logger = require('../config/logger');

const buildMailOptions = (to, subject, html) => ({
  from: env.email.from,
  to,
  subject,
  html,
});

const sendWelcomeEmail = async (user) => {
  const mailOptions = buildMailOptions(
    user.email,
    'Welcome to ChainEvent! 🎉',
    `<p>Hi ${user.name},</p><p>Welcome to ChainEvent. Start creating or attending events and earn NFT badges (POAPs) on the blockchain.</p>`
  );
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.warn('Failed to send welcome email', { error });
  }
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${env.clientUrl}/reset-password/${resetToken}`;
  const mailOptions = buildMailOptions(
    user.email,
    'Reset your ChainEvent password',
    `<p>Hi ${user.name},</p><p>Use the following link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>This link is valid for 30 minutes.</p>`
  );
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.warn('Failed to send password reset email', { error });
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
};

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNotificationEmail = async (to, studentName) => {
  const mailOptions = {
    from: `"School Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Notice: ${studentName} may be removed`,
    text: `Dear Parent,\n\nThis is to notify you that your child, ${studentName}, may be removed from our school system.\n\nRegards,\nSchool Admin`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendNotificationEmail;

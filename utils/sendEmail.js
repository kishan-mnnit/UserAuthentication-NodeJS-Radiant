const nodemailer = require('nodemailer');

// Function to send an email using nodemailer
const sendEmail = async (to, subject, html) => {
  // Create a transporter object using Gmail service and credentials from environment variables
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Sender email address
      pass: process.env.EMAIL_PASS  // Sender email password or app password
    }
  });

  // Send the email using the transporter
  await transporter.sendMail({
    from: process.env.EMAIL_USER, // Sender address
    to,                           // Receiver address
    subject,                      // Email subject
    html                          // Email content in HTML format
  });
};

// Export the sendEmail function for use in other modules
module.exports = sendEmail;

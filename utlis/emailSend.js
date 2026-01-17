const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

    auth: {
        user: process.env.EMAIL_USER, // FROM email//
        pass: process.env.EMAIL_PASS
    }
});


// ✅ Verify SMTP connection  ==== Veryfay your SMTP email server fatch is respond or not =====  
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error.message);
  } else {
    console.log("SMTP server ready to send emails");
  }
});


exports.sendLoginOtpEmail = async (toEmail, fullName, otp) => {
  return transporter.sendMail({
    from: `"SUP_SOCIAL_MEDIA" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Login Verification Code",
    html: `
      <h3>Hello ${fullName} 👋</h3>
      <p>Your login verification code is:</p>
      <h2>${otp}</h2>
      <p>This code is valid for 5 minutes.</p>
      <p>If this wasn’t you, please ignore this email.</p>
    `
  });
};





exports.sendLoginEmail = async (toEmail, fullName) => {
    await transporter.sendMail({
        from: `"SUP_SOCIAL_MEDIA" <${process.env.EMAIL_USER}>`, // enter your gmail or mail referal
        to: toEmail,                                 //  TO (logged-in user)
        subject: "Welcome to your profile",
        html: `
      <h3>Hello ${fullName} 👋</h3>
      <p>You have logged in successfully.</p>
      <p>If this was not you, please secure your account.</p>
      <br/>
      <p>— My App Team</p>
    `
    });
};
























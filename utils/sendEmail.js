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

exports.sendLoginEmail = async (email, name ) => {
   try {
    const info = await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`, // enter your gmail or mail referal
        to: email,                                 //  TO (logged-in user)
        subject: "Welcome to your profile",
        html: `
      <h3>Hello ${name} 👋</h3>
      <p>You have logged in successfully.</p>
      <p>If this was not you, please secure your account.</p>
      <br/>
      <p>— My App Team</p>
    `
    });

    console.log("Email sent successfully:" , info.messageId);
    
} catch (error) {
  console.error("Error sending email:" , error.message);
}
};

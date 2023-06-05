const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const {
  hashGenerator,
  otpGenerator,
  tokenGenerator,
  sendEmail,
  hashVerifier,
} = require("../global/global");

exports.signup = async (req, res) => {
  let { firstName, lastName, email, password, mobileNumber } = req.body;
  try {
    let user = await Admin.findOne({ email: email });
    if (user) {
      // compare password
      if (user.password) {
        const isMatch = await hashVerifier(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
      }
    }
    if (password) {
      password = await hashGenerator(password);
      
    }
    if (user && user.length > 2) {
      return res.status(401).json({ message: "No more users can be created!" });
    }
    if (!user) {
      user = new Admin({ firstName, lastName, email, password, mobileNumber });
      user = await user.save();
    } 
    if (user.isDeleted === true) {
      return res.status(401).json({ message: "User is deleted" });
    }
    let otp = otpGenerator();
    let otpExpiration = new Date(new Date().getTime() + 5 * 60 * 1000);

    // Send OTP to email
    const html = `<h1>Your OTP is ${otp}</h1>
        <p>OTP will expire in 5 minutes</p>
        <p>Thank you</p>
        `;
    const subject = "OTP for login";
    await sendEmail(email, subject, html);

    otp = await hashGenerator(otp.toString());

    user = await Admin.updateOne(
      { _id: user._id },
      { $set: { otp, otpExpiration } },
      { new: true }
    );

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.authenticate = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(req.body)
    let user = await Admin.findOne({ email: email });
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otpExpiration.getTime() < new Date().getTime()) {
      return res.status(401).json({ message: "OTP expired" });
    }

    if (!hashVerifier(otp, user.otp)) {
      return res.status(401).json({ message: "OTP is incorrect" });
    }
    let token = tokenGenerator({ email, userId: user._id });
    return res
      .status(200)
      .json({ message: "User authenticated successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    let user = await Admin.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.password) {
      req.body.password = await hashGenerator(req.body.password);
    }
    let { firstName, lastName, email, password, mobileNumber } = req.body;
    user = await Admin.updateOne(
      { _id: user._id },
      { $set: { firstName, lastName, email, password, mobileNumber } },
      { new: true }
    );

    // sendMail to user
    const html = `<h1>Your account has been updated successfully</h1>
            <p>Thank you</p>
            `;
    const subject = "Account updated";

    await sendEmail(email, subject, html);
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

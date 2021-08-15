const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {extend} = require("lodash")
const router = express.Router();
const { User } = require("../models/user.model");

router.post("/signup", async (req, res) => {
  const body = req.body;
  if (!(body.email && body.password)) {
    return res
      .status(401)
      .json({ success: false, errorMessage: "Enter all the details" });
  }
  const userExists = await User.findOne({ email: body.email });
  if (userExists) {
    return res.status(409).json({
      success: false,
      errorMessage: "Account already exists.Please Login to continue",
    });
  }
  const user = new User(body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.status(200).json({ success: true });
});

router.post("/login", async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ email: body.email });
  if (user) {
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      token = `Bearer ${token}`;
      return res.status(200).json({ success: true, token, userId: user._id });
    }

    return res
      .status(400)
      .json({ success: false, errorMessage: "Password is incorrect" });
  }
  res
    .status(401)
    .json({ success: false, errorMessage: "Email id does not exist" });
});

module.exports = router;
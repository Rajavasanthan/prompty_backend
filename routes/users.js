var express = require("express");
var router = express.Router();
const bcryptjs = require("bcryptjs");
const { User } = require("../model/user");
const jwt = require("jsonwebtoken");
/* GET users listing. */
router.post("/register", async function (req, res, next) {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });
    await user.save();
    return res.json({
      _id: user._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    if (user.isBlocked) {
      return res.status(401).json({
        message: "You are blocked. Please contact admin",
      });
    }
    const isMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Token
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res.json({token});
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;

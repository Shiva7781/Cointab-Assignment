const router = require("express").Router();
const User = require("../models/User.model.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  // Validate request

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(420).json({ error: "Input field can not be empty" });
  }

  try {
    const emailExist = await User.findOne({ email: email });

    if (emailExist) {
      return res.status(420).json({ error: "Email already exist" });
    }

    // Creating a new mongoose doc from user data also hashing the password
    const newUser = new User({
      email,
      password: bcrypt.hashSync(password, 11),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "User does not exist" });

    // For checking wrong password time of 24 hrs
    let wrongCountP = user.wrongPasswordCount;
    let updatedAtT = user.updatedAt;

    let updatedAtDate = new Date(updatedAtT).getDate();
    // console.log("updatedAtDate:", updatedAtDate);

    let UpdatedAtTime =
      new Date(updatedAtT).getHours() * 60 + new Date(updatedAtT).getMinutes();
    // console.log("UpdatedAtTime:", UpdatedAtTime);

    let currentDate = new Date().getDate();
    // console.log("currentDate:", currentDate);

    let currentTime = new Date().getHours() * 60 + new Date().getMinutes();
    // console.log("currentTime:", currentTime);

    let DateDiff = Math.floor(updatedAtDate - currentDate);
    // console.log("DateDiff:", DateDiff);
    //

    if (
      (wrongCountP === 5 && DateDiff === 0) ||
      (wrongCountP === 5 && DateDiff === 1 && currentTime < UpdatedAtTime)
    ) {
      return res
        .status(401)
        .json({ error: `Your account has been suspended for 24 hours` });
    }

    // account has been continued after 24 hrs of suspension and setting wrongPasswordCount: 0
    if (
      (wrongCountP === 5 && DateDiff > 1) ||
      (wrongCountP === 5 && DateDiff === 1 && currentTime >= UpdatedAtTime)
    ) {
      await User.updateOne(
        { email: user.email },
        { $set: { wrongPasswordCount: user.wrongPasswordCount * 0 } }
      );

      return res.status(401).json({ error: "Please try again" });
    }
    //

    // checking user password with hashed password stored in the database
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    console.log(validPassword);

    if (!validPassword) {
      await User.updateOne(
        { email: user.email },
        { $set: { wrongPasswordCount: user.wrongPasswordCount + 1 } }
      );

      return res.status(401).json({ error: "Wrong Email/Password" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3h",
    });

    // sending JWT with user data except password
    const { password, ...others } = user._doc;
    res.status(200).json({ accessToken, ...others });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;

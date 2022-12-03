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

    // checking user password with hashed password stored in the database
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    console.log(validPassword);

    if (!validPassword) {
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

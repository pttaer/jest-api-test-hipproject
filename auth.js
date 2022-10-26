const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
// const User = mongoose.model("User");
const User = require('./model/user')
//hash user password
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./key");
const requireLogin = require("./middleware/requireLogin");

// router.get('/', (req, res) => {
//     res.send("hello")
// })

router.get("/protected", requireLogin, (req, res) => {
  res.send("Hello");
});

router.post("/signup", (req, res) => {
  const { _id, username, email, password, phone } = req.body;
  const { role } = "user";
  const isPremium = false;
  if (!email || !password || !username || !phone) {
    return res.status(200).json({ msg: "Please add all the fields", code: "400" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(200)
          .json({ msg: "useralready exists with that email", code: "400" });
      }
      //Hash here
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          _id,
          username,
          password: hashedpassword,
          email,
          phone,
          role,
          isPremium,
        });
        //Save the user to database
        user
          .save()
          .then((user) => {
            res.json({ message: "saved successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.params;
  if (!email || !password) {
    res.status(200).json({ msg: "please add email or password", code: 400 });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      res.status(200).json({ msg: "Invaild Email or password", code: 400 });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({ message: "successfully signed, welcome " + savedUser.name + "!" })
          const accessToken = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          res.status(200).json({ msg: "Login successfully", code: 200, accessToken, data: savedUser });
        } else {
          res.status(400).json({ error: "Invaild Email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;

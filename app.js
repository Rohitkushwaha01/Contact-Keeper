const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let ObjectId;

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://new-rohit:rohit@cluster0.gotayl4.mongodb.net/KeeperDB"
);

const UsersSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const ContactSchema = new mongoose.Schema({
  Unique_id: Object,
  fname: String,
  lname: String,
  phoneNumber: Number,
  email: String,
});

const User = new mongoose.model("User", UsersSchema);
const Contact = new mongoose.model("Contact", ContactSchema);

app.listen(process.env.PORT || 2000, () => {
  console.log("server has started successfully");
});

app.get("/", (req, res) => {
  res.render("Main");
});

app.get("/Register", (req, res) => {
  res.render("Register");
});

app.get("/Login", (req, res) => {
  res.render("Login");
});

app.get("/Nouser", (req, res) => {
  res.render("Nouser");
});

app.get("/Incorrect", (req, res) => {
  res.render("Incorrect");
});

app.get("/Home", (req, res) => {
  res.render("Home");
});

app.get("/Saved", (req, res) => {
  Contact.find({ Unique_id: ObjectId }, function (err, results) {
    const contacts = results.map((contact) => ({
      id: contact._id,
      Fname: contact.fname,
      Lname: contact.lname,
      Email: contact.email,
      Phone: contact.phoneNumber,
    }));

    console.log(contacts);

    res.render("Saved", {
      contacts,
    });
  });
});

app.post("/Register", (req, res) => {
  const newUser = User({
    email: req.body.email,
    password: req.body.password,
  });

  ObjectId = newUser._id;

  newUser.save(function (err) {
    console.log(`you are Registered`);
    res.redirect("/Home");
  });
});

app.post("/Login", (req, res) => {
  const Email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: Email }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("Home");
        } else {
          res.redirect("/Incorrect");
        }
      } else {
        res.redirect("/Nouser");
      }
    }

    if (foundUser) {
      ObjectId = foundUser._id;
    }
  });
});

app.post("/Home", (req, res) => {
  User.findOne({}, function (err, results) {
    const newInfo = Contact({
      Unique_id: ObjectId,
      fname: req.body.fname,
      lname: req.body.lname,
      phoneNumber: req.body.phone,
      email: req.body.email,
    });

    console.log(newInfo);

    newInfo.save(function (err) {
      res.redirect("/Saved");
    });
  });
});

app.post("/delete", (req, res) => {
  const deletedItemId = req.body.deletebtn;
  Contact.findByIdAndDelete({ _id: deletedItemId }, function (err) {
    if (!err) {
      res.redirect("/Saved");
    } else {
      console.log(err);
    }
  });
});

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://<username>:<password>@cluster0.gotayl4.mongodb.net/KeeperDB"
);

const UsersSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const ContactSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  phoneNumber: Number,
  email: String,
});

const User = new mongoose.model("User", UsersSchema);
const Contact = new mongoose.model("Contact", ContactSchema);

app.get("/", (req, res) => {
  res.render("Main");
});

app.get("/Register", (req, res) => {
  res.render("Register");
});

app.post("/Register", (req, res) => {
  const newUser = User({
    email: req.body.email,
    password: req.body.password,
  });

  newUser.save(function (err) {
    console.log(`you are Registered`);
    res.redirect("/Home");
  });
});

app.get("/Login", (req, res) => {
  res.render("Login");
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
          res.send("incorrect password");
        }
      } else {
        res.send("no user");
      }
    }
  });
});

app.get("/Home", (req, res) => {
  res.render("Home");
});

app.post("/Home", (req, res) => {
  const newInfo = Contact({
    fname: req.body.fname,
    lname: req.body.lname,
    phoneNumber: req.body.phone,
    email: req.body.email,
  });

  newInfo.save(function (err) {
    res.redirect("/Home");
  });
});

app.get("/Saved", (req, res) => {
  Contact.find({}, function (err, results) {
    const contacts = results.map((contact) => ({
      id: contact._id,
      Fname: contact.fname,
      Lname: contact.lname,
      Email: contact.email,
      Phone: contact.phoneNumber,
    }));

    res.render("Saved", {
      contacts,
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

app.listen(process.env.PORT || 2000, () => {
  console.log("server has started successfully");
});

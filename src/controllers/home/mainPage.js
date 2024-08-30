const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const admin = require("../../database/auth");
const Category = require("../../database/category");
const bcrypt = require("bcrypt");
const app = express();
const publicDirectoryPath = path.join(__dirname, "../../public");
const viewsPath = path.join(__dirname, "../../views");

app.set("view engine", "ejs");
app.set("views", viewsPath);
app.use(express.static(publicDirectoryPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("home/index", { categories });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/about", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("home/about", { categories });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/dmca", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("home/dmca", { categories });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/contact", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("home/contact", { categories });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/privacy-policy", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("home/privacy-policy", { categories });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/terms-of-service", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("home/tos", { categories });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/disclaimer", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("home/disclaimer", { categories });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = app;

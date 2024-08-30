const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const admin = require("../../database/auth");
const Category = require("../../database/category");
const Post = require("../../database/post");
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
  const page = parseInt(req.query.page) || 1;
  const limit = 8;
  const search = req.query.search || "";

  try {
    const categories = await Category.find({});

    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category")
      .exec();

    const count = await Post.countDocuments(query);

    res.render("home/index", {
      posts,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      search,
      categories,
      limit,
    });
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

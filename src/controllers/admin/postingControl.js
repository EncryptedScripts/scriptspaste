const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Post = require("../../database/post");
const Category = require("../../database/category");
const Admin = require("../../database/auth");
const bcrypt = require("bcrypt");
const app = express();
const publicDirectoryPath = path.join(__dirname, "../../public");
const viewsPath = path.join(__dirname, "../../views");

app.set("view engine", "ejs");
app.set("views", viewsPath);
app.use(express.static(publicDirectoryPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/admin/login");
  }
  next();
}

app.post("/admin/posts", isAuthenticated, async (req, res) => {
  const {
    title,
    description,
    smallDescription,
    category: categoryTitle,
    subCategory: subCategoryTitle,
    Image,
    download,
    tutorial,
  } = req.body;

  try {
    const category = await Category.findOne({ title: categoryTitle });
    if (!category) {
      throw new Error("Category not found");
    }

    const subCategory = category.subCategories.find(
      (sub) => sub === subCategoryTitle
    );
    if (!subCategory) {
      throw new Error("Sub-category not found");
    }

    const newPost = new Post({
      title,
      description,
      smallDescription,
      category: category._id,
      subCategory: subCategory,
      Image,
      download,
      tutorial,
      createdAt: Date.now(),
    });

    await newPost.save();
    res.redirect("/admin/posts");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving post");
  }
});

app.post("/admin/posts/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/admin/posts");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting post");
  }
});

app.post("/admin/posts/edit/:id", isAuthenticated, async (req, res) => {
  const {
    title,
    description,
    smallDescription,
    category: categoryTitle,
    subCategory: subCategoryTitle,
    Image,
    download,
    tutorial,
  } = req.body;

  try {
    const category = await Category.findOne({ title: categoryTitle });
    if (!category) {
      throw new Error("Category not found");
    }

    const subCategory = category.subCategories.find(
      (sub) => sub === subCategoryTitle
    );
    if (!subCategory) {
      throw new Error("Sub-category not found");
    }

    await Post.findByIdAndUpdate(req.params.id, {
      title,
      description,
      smallDescription,
      category: category._id,
      subCategory: subCategory,
      Image,
      download,
      tutorial,
    });
    res.redirect(`/admin/posts`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating post");
  }
});

app.get("/admin/posts/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("category");
    const categories = await Category.find({});
    res.render("admin/editPost", { post, categories });
  } catch (error) {
    res.status(500).send("Error retrieving post for edit");
  }
});

app.get("/admin/posts", isAuthenticated, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
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

    res.render("admin/posts", {
      posts,
      categories,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      search,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving posts");
  }
});

module.exports = app;

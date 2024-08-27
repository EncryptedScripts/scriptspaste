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

// Category View Route
app.get("/categories/:categoryId", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const search = req.query.search || "";
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    const categories = await Category.find({});
    if (!category) {
      return res.status(404).send("Category not found");
    }

    const query = search
      ? {
          title: { $regex: search, $options: "i" },
          category: category._id,
        }
      : { category: category._id };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category")
      .exec();
    const count = await Post.countDocuments(query);

    res.render("home/category", {
      posts,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      search,
      categoryName: category.title,
      categories,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving posts");
  }
});

app.get("/categories/:categoryId/:subCategoryId", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const search = req.query.search || "";
  const { categoryId, subCategoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    const categories = await Category.find({});
    if (!category) {
      return res.status(404).send("Category not found");
    }

    const subCategory = category.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).send("SubCategory not found");
    }

    const query = search
      ? {
          title: { $regex: search, $options: "i" },
          category: category._id,
          subCategory: subCategory,
        }
      : { category: category._id, subCategory: subCategory };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category")
      .exec();
    const count = await Post.countDocuments(query);

    res.render("home/subcategory", {
      posts,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      search,
      categoryName: category.title,
      subCategoryName: subCategory,
      categories,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving posts");
  }
});

app.get("/search", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
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

    res.render("home/searchResult", {
      posts,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      search,
      categories,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving posts");
  }
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate("category");
    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Find the next post (newer)
    const nextPost = await Post.findOne({
      createdAt: { $gt: post.createdAt },
    })
      .sort({ createdAt: 1 })
      .limit(1);

    // Find the previous post (older)
    const previousPost = await Post.findOne({
      createdAt: { $lt: post.createdAt },
    })
      .sort({ createdAt: -1 })
      .limit(1);

    // Find related posts by subCategory and limit to 3
    const relatedPosts = await Post.find({
      subCategory: post.subCategory,
      _id: { $ne: post._id },
    })
      .sort({ createdAt: -1 })
      .limit(3);

    const categories = await Category.find({});
    const featuredPosts = await Post.find({}).sort({ createdAt: -1 }).limit(4);

    res.render("home/singlePage", {
      post,
      categories,
      featuredPosts,
      relatedPosts,
      nextPost,
      previousPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving post");
  }
});

module.exports = app;

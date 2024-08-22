const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
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

app.get("/admin/categories", isAuthenticated, async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("admin/categories", { categories });
  } catch (error) {
    res.status(500).send("Error retrieving categories");
  }
});

app.post("/admin/categories", isAuthenticated, async (req, res) => {
  const { title } = req.body;
  const newCategory = new Category({ title });

  try {
    await newCategory.save();
    res.redirect("/admin/categories");
  } catch (error) {
    res.status(500).send("Error saving category");
  }
});

app.post(
  "/admin/categories/subcategory/:id",
  isAuthenticated,
  async (req, res) => {
    const { subCategory } = req.body;

    try {
      await Category.findByIdAndUpdate(req.params.id, {
        $push: { subCategories: subCategory },
      });
      res.redirect("/admin/categories");
    } catch (error) {
      res.status(500).send("Error adding subcategory");
    }
  }
);

app.post("/admin/categories/edit/:id", isAuthenticated, async (req, res) => {
  const { title } = req.body;

  try {
    await Category.findByIdAndUpdate(req.params.id, { title });
    res.redirect("/admin/categories");
  } catch (error) {
    res.status(500).send("Error updating category");
  }
});

app.post("/admin/categories/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect("/admin/categories");
  } catch (error) {
    res.status(500).send("Error deleting category");
  }
});

app.post(
  "/admin/categories/subcategory/edit/:id/:index",
  isAuthenticated,
  async (req, res) => {
    const { subCategory } = req.body;
    const { id, index } = req.params;

    try {
      const category = await Category.findById(id);
      if (category) {
        category.subCategories[index] = subCategory;
        await category.save();
        res.redirect("/admin/categories");
      } else {
        res.status(404).send("Category not found");
      }
    } catch (error) {
      res.status(500).send("Error updating subcategory");
    }
  }
);

app.post(
  "/admin/categories/subcategory/delete/:id/:index",
  isAuthenticated,
  async (req, res) => {
    const { id, index } = req.params;

    try {
      const category = await Category.findById(id);
      if (category) {
        category.subCategories.splice(index, 1);
        await category.save();
        res.redirect("/admin/categories");
      } else {
        res.status(404).send("Category not found");
      }
    } catch (error) {
      res.status(500).send("Error deleting subcategory");
    }
  }
);

app.get("/admin/login", (req, res) => {
  res.render("admin/login");
});

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      req.session.user = admin;
      res.redirect("/admin/categories");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

module.exports = app;

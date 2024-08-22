const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Category = require("../../database/category");
const Admin = require("../../database/auth");
const DownloadSteps = require("../../database/downloadSteps");
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

app.get("/admin/downloadSteps", isAuthenticated, async (req, res) => {
  try {
    const downloadSteps = await DownloadSteps.find({});
    res.render("admin/downloadSteps", { downloadSteps });
  } catch (error) {
    res.status(500).send("Error retrieving download steps");
  }
});

app.post("/admin/downloadSteps", isAuthenticated, async (req, res) => {
  const { customUrl, likeVideoLink, subscribeYoutubeLink, destinationLink } =
    req.body;
  try {
    const newDownloadSteps = new DownloadSteps({
      customUrl,
      likeVideoLink,
      subscribeYoutubeLink,
      destinationLink,
    });
    await newDownloadSteps.save();
    res.redirect("/admin/downloadSteps");
  } catch (error) {
    res.status(500).send("Error saving download steps");
  }
});

app.post("/admin/downloadSteps/edit/:id", isAuthenticated, async (req, res) => {
  const { customUrl, likeVideoLink, subscribeYoutubeLink, destinationLink } =
    req.body;
  try {
    await DownloadSteps.findByIdAndUpdate(req.params.id, {
      customUrl,
      likeVideoLink,
      subscribeYoutubeLink,
      destinationLink,
    });
    res.redirect("/admin/downloadSteps");
  } catch (error) {
    res.status(500).send("Error updating download steps");
  }
});

app.post(
  "/admin/downloadSteps/delete/:id",
  isAuthenticated,
  async (req, res) => {
    try {
      await DownloadSteps.findByIdAndDelete(req.params.id);
      res.redirect("/admin/downloadSteps");
    } catch (error) {
      res.status(500).send("Error deleting download steps");
    }
  }
);

module.exports = app;

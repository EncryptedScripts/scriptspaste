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

app.get("/:customUrl", async (req, res) => {
  try {
    const downloadSteps = await DownloadSteps.findOne({
      customUrl: req.params.customUrl,
    });

    if (!downloadSteps) {
      return res.status(404).send("Download steps not found");
    }

    res.render("home/downloadStepsRender", { downloadSteps });
  } catch (error) {
    res.status(500).send("Error retrieving download steps");
  }
});

module.exports = app;

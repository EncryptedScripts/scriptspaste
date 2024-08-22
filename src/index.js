require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const layouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
const publicDirectoryPath = path.join(__dirname, "/public");
const viewsPath = path.join(__dirname, "/views");
const rateLimit = require("express-rate-limit");
const login = require("./controllers/auth/login");
const main = require("./controllers/home/mainPage");
const adminPost = require("./controllers/admin/postingControl");
const adminCategory = require("./controllers/admin/categoryControl");
const postingPage = require("./controllers/home/postingPage");
const adminDownloadSteps = require("./controllers/admin/downloadStepsControl");
const downloadStepsLoader = require("./controllers/home/downloadSteps");

app.set("view engine", "ejs");
app.set("views", viewsPath);
app.use(express.static(publicDirectoryPath));
app.use(express.static(path.join(__dirname, "dist")));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(mongoSanitize());
app.use(cors());

/*
=====================================================
===== ROUTES =========================================
=====================================================
*/

app.use(login);
app.use(main);
app.use(adminPost);
app.use(adminCategory);
app.use(postingPage);
app.use(adminDownloadSteps);
app.use(downloadStepsLoader);

/*
=====================================================
===== ROUTES =========================================
=====================================================
*/

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

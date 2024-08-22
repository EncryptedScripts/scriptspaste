const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/scriptspaste")
  .then(() => {
    console.log("mongoose connected for post model");
  })
  .catch((e) => {
    console.log("failed to connect to MongoDB");
  });

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  smallDescription: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Image: {
    type: String,
    required: true,
  },
  download: {
    type: String,
    required: true,
  },
  tutorial: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

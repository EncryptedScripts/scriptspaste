const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/scriptspaste")
  .then(() => {
    console.log("mongoose connected for category model");
  })
  .catch((e) => {
    console.log("failed to connect to MongoDB");
  });

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subCategories: [
    {
      type: String,
    },
  ],
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;

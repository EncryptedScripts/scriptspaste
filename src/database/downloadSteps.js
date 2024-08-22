const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/scriptspaste")
  .then(() => {
    console.log("mongoose connected for download steps model");
  })
  .catch((e) => {
    console.log("failed to connect to MongoDB");
  });

const downloadStepsSchema = new mongoose.Schema({
  customUrl: {
    type: String,
    required: true,
  },
  likeVideoLink: {
    type: String,
    required: true,
  },
  subscribeYoutubeLink: {
    type: String,
    required: true,
  },
  destinationLink: {
    type: String,
    required: true,
  },
});

const DownloadSteps = mongoose.model("DownloadSteps", downloadStepsSchema);
module.exports = DownloadSteps;

const mongoose = require("mongoose");

const trainingSchema = mongoose.Schema({
  serviceName: { type: String, required: true },
  serviceUrl: { type: String, required: true },
  authType: { type: String, required: true },
  requestContent: { type: String, required: true },
  responseContent: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Training", trainingSchema);

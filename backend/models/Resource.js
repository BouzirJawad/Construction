const mongoose = require("mongoose");

const ResourceSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type:{
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  description: {
    type: String,
    required: true
  },
  supplier:{
    type: String,
    required: true
  }
});

const resourceSchema = mongoose.model("Resource", ResourceSchema);
module.exports = resourceSchema;

const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    require: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
    },
  ],
  projectId:{
    type: String,
  }
});

const taskModel = mongoose.model("Task", TaskSchema);
module.exports = taskModel;

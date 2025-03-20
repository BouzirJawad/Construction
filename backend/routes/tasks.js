const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require('../models/Project')
const Resource = require('../models/Resource')

router.post("/", async (req, res) => {
    try {
        const { description, startDate, endDate, projectId } = req.body;
        
        const task = new Task({ description, startDate, endDate });
        await task.save();

        if (projectId) {
            const project = await Project.findById(projectId);

            if (project) {

                project.tasks.push(task._id);
                await project.save();

            } else {
                return res.status(404).json({ message: "Project not found" });
            }
        }else{
            return res.status(404).json({ message: "Id required" });
        }

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({message: error.message });
    }
});


router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().populate("resources")
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await Resource.deleteMany({ _id: { $in: task.resources } });

        await Project.updateMany(
            { tasks: req.params.id },
            { $pull: { tasks: req.params.id } }
        );

        await Task.findByIdAndDelete(req.params.id);

        res.json({ message: "Task and associated resources deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

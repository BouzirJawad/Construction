const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require('../models/Task')
const Resource = require('../models/Resource')

router.post("/", async (req, res) => {
    try {
        const { name, description, startDate, budget, endDate} = req.body
        const project = new Project({name, description, startDate, endDate, budget })

        await project.save()
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().populate({
            path: "tasks",
            populate: { path: "resources" }
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate({
                path: "tasks",
                populate: { path: "resources" }
            });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate("tasks");

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const tasks = await Task.find({ _id: { $in: project.tasks } });

        const resourceIds = tasks.flatMap(task => task.resources);

        if (resourceIds.length > 0) {
            await Resource.deleteMany({ _id: { $in: resourceIds } });
        }

        if (project.tasks.length > 0) {
            await Task.deleteMany({ _id: { $in: project.tasks } });
        }

        await Project.findByIdAndDelete(req.params.id);

        res.json({ message: "Project, associated tasks, and resources deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

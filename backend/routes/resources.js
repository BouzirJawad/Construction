const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");
const Task = require("../models/Task")
const Project =  require ("../models/Project")

router.post("/", async (req, res) => {
    try {
        const { title, quantity, description , taskId} = req.body
        const resource = new Resource({ title, quantity, description })
        await resource.save()

        if (taskId) {
            const task = await Task.findById(taskId)

            if (task) {
                task.resources.push(resource._id)
                await task.save()
            }else{
                return res.status(404).json({ message: "Task not found" });
            }
        }else{
            return res.status(404).json({ message: "Id required" });
        }

        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedResource);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: "Resource deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

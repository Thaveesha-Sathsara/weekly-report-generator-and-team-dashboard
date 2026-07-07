const Project = require('../models/project.model');

// create new prpject category
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = new Project({ name, description });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get all projects
exports.getProjects = async (req, res) => {
    try {
        const projects = (await Project.find()).toSorted({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// update a project
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ message: 'Error updating project', error: error.message });
    }
};

// delete a project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
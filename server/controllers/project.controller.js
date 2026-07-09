const Project = require('../models/project.model');

exports.getProjects = async (req, res) => {
    try {
        let query = { status: 'Active' };
        
        if (req.user.role !== 'Manager') {
            query.teamMembers = req.user.id;
        }

        const projects = await Project.find(query)
            .populate('teamMembers', 'fullName email')
            .sort({ createdAt: -1 });
            
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('teamMembers', 'fullName email role');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createProject = async (req, res) => {
    try {
        const { name, description, teamMembers } = req.body;
        const project = new Project({ name, description, teamMembers });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { name, description, teamMembers } = req.body;
        const project = await Project.findByIdAndUpdate(
            req.params.id, 
            { name, description, teamMembers }, 
            { new: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ message: 'Error updating project', error: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
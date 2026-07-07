const express = require('express');
const router = express.Router();
const {
    createProject,
    getProjects,
    updateProject,
    deleteProject
} = require('../controllers/project.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.post('/', protect, adminOnly, createProject);
router.get('/', protect, getProjects);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);
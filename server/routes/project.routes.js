const express = require('express');
const router = express.Router();
const {
    createProject,
    getProjects,
    updateProject,
    deleteProject,
    getProjectById
} = require('../controllers/project.controller');
const { protect, managerOnly } = require('../middleware/auth.middleware');

router.post('/', protect, managerOnly, createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, managerOnly, updateProject);
router.delete('/:id', protect, managerOnly, deleteProject);

module.exports = router;
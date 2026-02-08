const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/applications
// @desc    Create new application
// @access  Private (User)
router.post('/', protect, async (req, res) => {
  try {
    const { position } = req.body;

    const application = await Application.create({
      user: req.user.id,
      position,
      stages: [
        { name: 'Application Submitted', status: 'completed', completedAt: new Date() },
        { name: 'Document Verification', status: 'pending' },
        { name: 'Medical Examination', status: 'pending' },
        { name: 'Background Verification', status: 'pending' },
        { name: 'Final Clearance', status: 'pending' }
      ]
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/applications
// @desc    Get all applications (Admin) or user's applications (User)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let applications;

    if (req.user.role === 'admin') {
      applications = await Application.find().populate('user', 'name email phone');
    } else {
      applications = await Application.find({ user: req.user.id });
    }

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('user', 'name email phone');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check if user owns application or is admin
    if (application.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this application' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/applications/:id/stage
// @desc    Update application stage (Admin only)
// @access  Private/Admin
router.put('/:id/stage', protect, authorize('admin'), async (req, res) => {
  try {
    const { currentStage, stageStatus } = req.body;
    
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.currentStage = currentStage;
    
    // Update stage status
    const stageIndex = application.stages.findIndex(s => s.name === currentStage);
    if (stageIndex !== -1) {
      application.stages[stageIndex].status = stageStatus;
      if (stageStatus === 'completed') {
        application.stages[stageIndex].completedAt = new Date();
      }
    }

    await application.save();

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete application (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
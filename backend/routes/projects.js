const router = require('express').Router();
const multer = require('multer');
const Project = require('../models/Project');
const Image = require('../models/Image');
const Feedback = require('../models/Feedback');
const Comment = require('../models/Comment'); // Import Comment model
const { analyzeImage } = require('../ai');
const { uploadFileToS3, deleteFileFromS3 } = require('../s3Service'); // Import S3 services

// Multer setup for file uploads - using memory storage for S3 upload
const upload = multer({ storage: multer.memoryStorage() });

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  try {
    const newProject = new Project({ name });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Get a single project with its images
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate({
      path: 'images',
      populate: { path: 'feedback' }
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/projects/:id/images
// @desc    Upload an image to a project and trigger analysis
router.post('/:id/images', upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Upload image to S3
    const s3Url = await uploadFileToS3(req.file);

    const newImage = new Image({
      filename: req.file.originalname, // Use originalname as filename
      path: s3Url, // Store S3 URL as path
      originalName: req.file.originalname,
      project: project._id,
    });

    const savedImage = await newImage.save();

    project.images.push(savedImage._id);
    await project.save();

    // Trigger AI analysis (savedImage.path now contains S3 URL)
    const feedbackItems = await analyzeImage(savedImage.path);

    const feedbackToSave = feedbackItems.map((item) => ({
      ...item,
      image: savedImage._id,
    }));

    const savedFeedback = await Feedback.insertMany(feedbackToSave);

    savedImage.feedback.push(...savedFeedback.map((f) => f._id));
    await savedImage.save();


    res.status(201).json(savedImage);
  } catch (err) {
    console.error('Error uploading image or processing feedback:', err);
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project and all its related data
router.delete('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find all images for the project
    const images = await Image.find({ project: projectId });

    // Delete all related data for each image
    for (const image of images) {
      // Delete from S3
      if (image.path) { // image.path holds the S3 URL
        await deleteFileFromS3(image.path);
      }

      // Delete feedback and comments
      await Feedback.deleteMany({ image: image._id });
      await Comment.deleteMany({ image: image._id });
    }

    // Delete all images for the project from the database
    await Image.deleteMany({ project: projectId });

    // Delete the project itself
    await Project.findByIdAndDelete(projectId);

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
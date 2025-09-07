
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true,
  },
  category: {
    type: String,
    enum: ['Accessibility', 'Visual Hierarchy', 'Content & Copy', 'UI/UX Patterns'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  recommendation: {
    type: String,
    required: true,
  },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  roles: [
    {
      type: String,
      enum: ['Designer', 'Reviewer', 'Product Manager', 'Developer'],
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;

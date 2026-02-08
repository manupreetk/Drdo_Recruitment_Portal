const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'rejected'],
    default: 'in-progress'
  },
  currentStage: {
    type: String,
    enum: [
      'Application Submitted',
      'Document Verification',
      'Medical Examination',
      'Background Verification',
      'Final Clearance'
    ],
    default: 'Application Submitted'
  },
  stages: [{
    name: String,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    completedAt: Date
  }],
  documents: {
    type: Map,
    of: Boolean,
    default: {
      'Birth Certificate': false,
      'Educational Certificates': false,
      'Experience Letters': false,
      'Caste Certificate (if applicable)': false,
      'Medical Fitness Certificate': false,
      'Character Certificate': false,
      'Photo ID Proof (Aadhaar/PAN)': false,
      'Passport Size Photographs': false
    }
  },
  notes: String,
  submittedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate unique application ID
applicationSchema.pre('save', async function(next) {
  if (!this.applicationId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Application').countDocuments();
    this.applicationId = `APP${year}${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
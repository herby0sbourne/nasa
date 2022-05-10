const mongoose = require('mongoose');

const launchSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  target: {
    type: String,
    // required: true,
    // enum: { values: ['Coffee', 'Tea'], message: '{VALUE} is not supported' },
    enum: {
      values: [
        'Kepler-1652 b',
        'Kepler-1410 b',
        'Kepler-296 A f',
        'Kepler-442 b',
        'Kepler-296 A e',
        'Kepler-1649 b',
        'Kepler-62 f',
        'Kepler-452 b',
      ],
      message: '{VALUE} is not supported',
    },
  },
  customers: {
    type: Array,
    default: ['ZTM', 'NASA'],
  },
  upcoming: {
    type: Boolean,
    default: true,
  },
  success: {
    type: Boolean,
    default: true,
  },
});

launchSchema.methods.toJSON = function () {
  const launchObject = this.toObject();
  delete launchObject._id;
  delete launchObject.__v;
  // delete launchObject.active;
  return launchObject;
};

const Launch = mongoose.model('launches', launchSchema);

module.exports = Launch;

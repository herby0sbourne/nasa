const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
  KeplerName: {
    type: String,
    required: true,
  },
});

planetSchema.methods.toJSON = function () {
  const planetObject = this.toObject();

  delete planetObject._id;
  delete planetObject.__v;

  return planetObject;
};

const Planet = mongoose.model('planets', planetSchema);

module.exports = Planet;

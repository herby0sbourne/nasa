const { planets, testdata } = require('../models/planetsModel');
const Planets = require('../models/planetSchema');

exports.getAllPlanets = async (req, res, next) => {
  try {
    const planets = await Planets.find({});
    res.status(200).send(planets);
  } catch (err) {
    console.error(`no planets found ${err}`);
  }
  // res.status(200).send(testdata());
};

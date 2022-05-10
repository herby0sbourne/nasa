const {
  launchData,
  scheduleNewlaunch,
  existsLaunchWithID,
  abortLaunch,
} = require('../models/launchesModel');

const pagination = require('../utils/pagination');

const Launch = require('../models/launchSchema');
const Planet = require('../models/planetSchema');

exports.getAllLaunches = async (req, res, next) => {
  try {
    const { skip, limit } = pagination(req.query);

    const launches = await Launch.find({})
      .sort({ flightNumber: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).send(launches);
  } catch (err) {
    console.log(err);
  }
  // res.status(200).send(launchData());
};

exports.createNewLaunch = async (req, res, next) => {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).send({
      error: 'Missing required launch property',
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).send({
      error: 'invalid date',
    });
  }

  await scheduleNewlaunch(launch);
  res.status(201).send(launch);
};

exports.DeleteLaunch = async (req, res) => {
  const launchid = +req.params.id;

  const launch = await Launch.findOne({ flightNumber: launchid });

  if (!launch) {
    return res.status(404).send({ error: 'launch not found' });
  }

  launch.upcoming = false;
  launch.success = false;
  // if (!existsLaunchWithID(launchid)) {
  //   return res.status(404).send({ error: 'launch not found' });
  // }

  // const aborted = abortLaunch(launchid);
  // return res.status(200).send(aborted);

  await launch.save();

  return res.status(204).send('null');
};

const axios = require('axios');
const Launch = require('./launchSchema');
const Planet = require('./planetSchema');

const launches = new Map();
let latestFlightNumber = 100;
const DEFAULT_LAUNCH_NUMBER = 100;

// const launch = {
//   flightNumber: 100, //flight_number
//   mission: 'Kepler Exploration', // name
//   rocket: 'Explorer ISI', // rocket.name
//   launchDate: new Date('December 27,2030'), // date_local
//   target: 'Kepler-442 b', // not applicable
//   customers: ['ZTM', 'NASA'], // payloads.customers for each payload
//   upcoming: true, // upcoming
//   success: true, // success
// };

// launches.set(launch.flightNumber, launch);
const saveLaunch = async (launch) => {
  await Launch.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
    new: true,
    runValidators: true,
  });
};

// saveLaunch(launch);

const findLaunch = async (filter) => {
  return await Launch.findOne(filter);
};

async function existsLaunchWithID(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

const getLatestFlightNumber = async () => {
  const latestLaunch = await Launch.findOne().sort('-flightNumber');

  if (!latestLaunch) return DEFAULT_LAUNCH_NUMBER;

  return latestLaunch.flightNumber;
};

function launchData() {
  return Array.from(launches.values());
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: ['zero to mastery,NASA'],
//       flightNumber: latestFlightNumber,
//     })
//   );
// }

const scheduleNewlaunch = async (launch) => {
  const planet = await Planet.findOne({ KeplerName: launch.target });

  if (!planet) {
    return res.status(400).send({
      error: 'Planet not found',
    });

    // throw new Error(`Planet not found`);
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['zero to mastery', 'NASA'],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
};

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const spaceXData = async () => {
  const firstLaunchData = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunchData) {
    console.log('launch data already loaded');
  } else {
    await spaceXDataPopulate();
  }
};

const spaceXDataPopulate = async () => {
  console.log('loading data');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('problem downloading data');
    throw new Error('Launch data failed o download');
  }

  const spacexDatas = response.data.docs;
  for (const spacexData of spacexDatas) {
    const { payloads } = spacexData;
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: spacexData['flight_number'],
      mission: spacexData['name'],
      rocket: spacexData['rocket']['name'],
      launchDate: spacexData['date_local'],
      upcoming: spacexData['upcoming'],
      success: spacexData['success'],
      customers,
    };

    // console.log(launch);
    // console.log(payloads);

    await saveLaunch(launch);
  }
};

function abortLaunch(launchid) {
  const aborted = launches.get(launchid);
  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}

module.exports = {
  launchData,
  // addNewLaunch,
  scheduleNewlaunch,
  existsLaunchWithID,
  abortLaunch,
  spaceXData,
  // getLatestFlightNumber,
};

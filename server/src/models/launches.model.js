const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  try {
    const response = await axios.post(SPACEX_API_URL, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: 'rocket',
            select: {
              name: 1
            }
          },
          {
            path: 'payloads',
            select: {
              customers: 1
            }
          }
        ]
      }
    });

    if (response.status !== 200) {
      console.log('Problem downloading launch data');
      throw new Error('Launch data download failed!');
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
      const payloads = launchDoc['payloads'];
      const customers = payloads.flatMap((payload) => {
        return payload['customers'];
      });

      const launch = {
        flightNumber: launchDoc['flight_number'],
        mission: launchDoc['name'],
        rocket: launchDoc['rocket']['name'],
        launchDate: launchDoc['date_local'],
        upcoming: launchDoc['upcoming'],
        success: launchDoc['success'],
        customers
      };

      console.log(`${launch.flightNumber} ${launch.mission}`);
      await saveLaunch(launch);
    }
  } catch (e) {
    console.log(e);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  });

  if (firstLaunch) {
    console.log('Launch data already loaded');
    return;
  }

  await populateLaunches();
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function getLaunchById(id) {
  return await findLaunch({
    flightNumber: id
  });
}

async function getLatestFlightNumber() {
  const latestFlightNumber = await launches.findOne().sort('-flightNumber');

  if (!latestFlightNumber) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestFlightNumber.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find(
      {},
      {
        _id: 0,
        __v: 0
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber
    },
    launch,
    {
      upsert: true
    }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if (!planet) {
    throw new Error('No matching planet was found');
  }

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: (await getLatestFlightNumber()) + 1
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(id) {
  const aborted = await launches.updateOne(
    {
      flightNumber: id
    },
    {
      upcoming: false,
      success: false
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  getLaunchById,
  abortLaunchById,
  scheduleNewLaunch,
  loadLaunchData
};

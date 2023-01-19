const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 3030'),
  target: 'Kepler-442 b',
  customer: ['NASA', 'ZTM'],
  upcoming: true,
  success: true
};

saveLaunch(launch);

async function getLaunchById(id) {
  return await launches.findOne({
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

async function getAllLaunches() {
  return await launches.find(
    {},
    {
      _id: 0,
      __v: 0
    }
  );
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if (!planet) {
    throw new Error('No matching planet was found');
  }

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
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: await getLatestFlightNumber() + 1
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(id) {
  const aborted = await launches.updateOne({
    flightNumber: id
  }, {
    upcoming: false,
    success: false
  });

  return  aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  getLaunchById,
  abortLaunchById,
  scheduleNewLaunch
};

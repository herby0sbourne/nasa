const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const Planet = require('./planetSchema');

// const planets = [];

const isHabitablePlanets = (planet) => {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
};

/* const promise = new Promise((resolve, reject) => {
  resolve(42);
});
promise.then((results) => {});
const results = await promise;
console.log(results); */
const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', 'data', 'kepler_data.csv'))
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanets(data)) {
          savePlanet(data);
          // planets.push(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        // console.log(planets['kepler_name:']);
        // console.log(
        //   planets.map((planet) => {
        //     return planet['kepler_name:'];
        //   })
        // );
        // console.log(`${planets.length} habitable planets found`);
        console.log(`${(await Planet.find()).length} habitable planets found`);
        resolve();
      });
  });
};

const savePlanet = async (planets) => {
  try {
    await Planet.updateOne(
      {
        KeplerName: planets.kepler_name,
      },
      { keplerName: planets.kepler_name },
      { upsert: true }
    );
  } catch (err) {
    console.log(`could not save an error ${err}`);
  }
};

module.exports = {
  // planets,
  loadPlanetsData,
};

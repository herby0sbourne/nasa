const http = require('http');
require('dotenv').config();
const app = require('./app');
const { mongoConnect } = require('./db');

const { loadPlanetsData } = require('../models/planetsModel');
const { spaceXData } = require('../models/launchesModel');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

(async function () {
  await mongoConnect();
  await loadPlanetsData();
  await spaceXData();

  server.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
})();

// mongoose.connection.on('open', () => {
//   console.log('connection ready');
// });
// mongoose.connection.on('error', (err) => {
//   console.error(err);
// });

// const startServer = async () => {
//   await loadPlanetsData();

//   server.listen(PORT, () => {
//     console.log(`server running on http://localhost:${PORT}`);
//   });
// };

// startServer();

// const app = require('./app');
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`server running on http://localhost:${PORT}`);
// });

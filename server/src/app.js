const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const planetsRouter = require('../routes/planetsRoutes');
const launchesRouter = require('../routes/launchesRoutes');

app = express();

app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:3000 ',
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1/planets', planetsRouter);
app.use('/v1/launches', launchesRouter);

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

module.exports = app;

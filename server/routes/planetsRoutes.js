const express = require('express');
const planetsController = require('./planetsController');
const router = express.Router();

// router.route('/planets').get(getAllPlanets);
router.get('/', planetsController.getAllPlanets);

module.exports = router;

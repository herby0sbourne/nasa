const express = require('express');
const launchesController = require('./launchesController');
router = express.Router();

router.get('/', launchesController.getAllLaunches);
router.post('/', launchesController.createNewLaunch);
router.delete('/:id', launchesController.DeleteLaunch);

module.exports = router;

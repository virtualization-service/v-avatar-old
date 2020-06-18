const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const trainingController = require('../controllers/training-controller');

router.get("", trainingController.getTraining);

// router.post("", checkAuth, trainingController.addNewTraining);

module.exports = router;
    
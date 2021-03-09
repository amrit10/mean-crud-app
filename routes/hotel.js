const express = require('express');
const {check, body} = require('express-validator');

const isAuth = require('../middleware/is-auth');
const hotelController = require('../controllers/hotel');

const router = express.Router();

router.post('/hotels',isAuth, hotelController.getAvailableHotels );

module.exports = router;
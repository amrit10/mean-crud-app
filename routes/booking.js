const express = require('express');
const {body} = require('express-validator');

const isAuth = require('../middleware/is-auth');
const bookingController = require('../controllers/booking');

const router = express.Router();

router.get('/bookings', isAuth,bookingController.getBookings );
router.post('/bookHotel', isAuth,
    [
        body('startDate'),
        body('endDate').custom((value, {req}) => {
            if(new Date(value) <= new Date(req.body.startDate)) {
                return Promise.reject("End Date should be after start date");
            }
        } )
    ],
    bookingController.postBookHotel 
);

module.exports = router;
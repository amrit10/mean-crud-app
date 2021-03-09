const  {validationResult} = require('express-validator');

const Hotel = require('../models/hotel');
const Booking = require('../models/booking');

exports.getAvailableHotels = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log(errors);
            const error = new Error('Validation Failed. Entered data is incorrect');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const startDate = req.body.startDate;
        const endDate = req.body.endDate;

        const bookings = await Booking.find({startDate: {"$gte": new Date(new Date(startDate).setHours(00, 00, 00))}, endDate: {"$lte": new Date(new Date(endDate).setHours(23, 59, 59))} }).select("hotelId");

        const unavailableHotels = bookings.map(booking => {
            return booking.hotelId
        })

        const hotels = await Hotel.find({_id: {"$nin": unavailableHotels}});
        
        res.status(200).json({
            hotels: hotels
        })

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


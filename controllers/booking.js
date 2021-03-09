const  {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const Hotel = require('../models/hotel');
const Booking = require('../models/booking');
const User = require('../models/user');

exports.getBookings = async (req, res, next) => {
    try {   
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log(errors);
            const error = new Error('Validation Failed. Entered data is incorrect');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const userId = req.userId;
        const bookings = await User.findById(userId).populate({path: "bookings", populate: {path: "hotelId", model: "Hotel"}});
        const bookingInformation = bookings.bookings.map(booking => {
            return {
                _id: booking._id,
                startDate: booking.startDate,
                endDate: booking.endDate,
                hotelName: booking.hotelId.name,
                hotelAddress: booking.hotelId.address
            };
        });

        res.status(200).json({
            message: "Bookings Fetched",
            bookings: bookingInformation
        });

    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }

        next(err);
    }
};

exports.postBookHotel = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log(errors);
            const error = new Error('Validation Failed. Entered data is incorrect');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const userId = req.userId;
        const hotelId = req.body.hotelId;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;

        const booking = new Booking({
            startDate: startDate,
            endDate: endDate,
            userId: userId,
            hotelId: hotelId
        })      

        await booking.save();

        const user = await User.findById(userId);
        user.bookings.push(booking._id);
        await user.save();

        const hotel = await Hotel.findById(hotelId);
        hotel.bookings.push(booking._id);
        await hotel.save();

        res.status(201).json({
            message: "Booking successful",
            booking: booking
        });

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }
};
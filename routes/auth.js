const express = require('express');
const {body} = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.post('/signup'
,[
        body('email').trim().isEmail().normalizeEmail()
            .custom((value, {req}) => {
                return User.findOne({email: value}).then(user => {
                    if(user) {
                        return Promise.reject("Email already exists");
                    }
                });
            }),
        body('password').trim().isLength({min: 6}),
        body('name').trim().not().isEmpty(),
    ]
    ,
    authController.postSignup
);

router.post('/login', [
        body('email').trim().isEmail().normalizeEmail(),
        body('password').trim().isLength({min: 6}),
    ],
    authController.postLogin
);

module.exports = router;
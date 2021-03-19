const express = require('express');
const {body} = require('express-validator');

const employeeController = require('../controllers/employee');

const router = express.Router();

const SKILLS = ['Engineering', 'Marketing', 'Hippie', 'Evil', 'Management', 'Value Investing', 'Painting', 'Funny'  ];


router.post('/addEmployee',
    [
        body('name').trim().not().isEmpty(),
        body('dob').not().isEmpty().isDate(),
        body('salary').isNumeric().not().isEmpty()
    ]
    ,employeeController.postAddEmployee
);
router.get('/getEmployees', employeeController.getEmployees);
router.delete('/deleteEmployee/:employeeId', employeeController.deleteRemoveEmployee);
router.get('/editEmployee/:employeeId', employeeController.getEmployee);
router.put('/editEmployee', 
    [
        body('name').trim().not().isEmpty(),
        body('dob').not().isEmpty().isDate(),
        body('salary').isNumeric().not().isEmpty()
    ]
    ,
    employeeController.putEditEmployee
);
router.get('/getEmployee/:employeeId', employeeController.getEmployee);

module.exports = router;
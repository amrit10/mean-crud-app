const  {validationResult} = require('express-validator');
const fs = require('fs').promises;

const Employee = require('../models/employee');
const { search } = require('../routes/employee');

const ITEMS_PER_PAGE = 3;

exports.postAddEmployee = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log(errors);
            const error = new Error('Validation Failed. Entered data is incorrect');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const name = req.body.name;
        const dob = req.body.dob;
        const salary = req.body.salary;
        const skills = JSON.parse(req.body.skills);
        const photo = req.file.path;

        const employee = await Employee.create({
            name: name,
            dob: dob,
            salary: salary,
            skills: skills,
            photo: photo
        });

        res.status(201).json({
            message: 'Employee Added Successfully',
            employee: employee
        });

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.putEditEmployee = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log(errors);
            const error = new Error('Validation Failed. Entered data is incorrect');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const name = req.body.name;
        const dob = req.body.dob;
        const salary = req.body.salary;
        const skills = JSON.parse(req.body.skills);
        const photo = req.hasOwnProperty('file') ?  req.file.path : null;
        const employeeId = req.body._id;

        const employee = await Employee.findById(employeeId);
        const imagePath = employee.photo;

        employee.name = name;
        employee.dob = dob;
        employee.salary = salary;
        employee.skills = skills;
        
        if(photo) {
            employee.photo = photo;
        }

        await employee.save()

        photo? await fs.unlink(imagePath) : null
        

        res.status(200).json({
            message: 'Employee Updated Successfully',
            employee: employee
        });

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteRemoveEmployee = async (req, res, next) => {
    try {
        const employeeId = req.params.employeeId;

        const imagePath = await Employee.findById(employeeId).select('photo');
        await Employee.deleteOne({_id: employeeId});

        await fs.unlink(imagePath.photo);

        res.status(200).json({
            message: 'Employee Removed!'
        });

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.employeeId);

        res.status(200).json({
            employee: employee,
            message: "Employee Fetched"
        });

    } catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEmployees = async (req, res, next) => {
    try {      
        const searchKey = req.query.search === undefined ? "" : req.query.search;
        let page = +req.query.page || 1;

        const totalEmployees = await Employee.find({name: {$regex: searchKey, $options: "i"}});
        const totalPages = Math.ceil(totalEmployees.length/ITEMS_PER_PAGE);
        

        if(page > totalPages) {
            page = totalPages;
        }
        const employees = await Employee.find({name: {$regex: searchKey, $options: "i"}}).sort({eid: 1}).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
        
        const totalItems = totalEmployees.length;
    
        // totalItems = await Employee.find()
        //     .countDocuments()

        res.status(200).json({
            employees : employees,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        })
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}
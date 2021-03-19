const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const path = require('path');
const {uuid} = require('uuidv4');

const PORT = process.env.PORT || 3000;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // cb(null, file.filename + '-' + file.originalname);
        cb(null, uuid() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg"){
        cb(null, true);
    }else{
        cb(null, false);
    }
}
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-gllbp.mongodb.net/${process.env.MONGO_DEFAULT_DB}`;;

const app = express();

const employeeRoutes = require('./routes/employee');

app.use(compression());
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter, limits: {fileSize: 10*1024*1024}}).single('image'));
app.use('/images',express.static(path.join(__dirname, 'images')));

// adding headers for allowing CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allowing * origins/domains, * means all, we can write comma separated domains
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // allow the methods that the above mentioned origins can access
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // allow headers of requests that the client can send such requests
    next();
})


app.use(employeeRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    });
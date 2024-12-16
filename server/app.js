let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let connectDB = require('./controllers/dbManager');

require('dotenv').config({path: path.join(__dirname, '.env')});
//default router
let router = require('./routes/index');
let users = require('./routes/users');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

class User {
    constructor(id, name, username, email, password, goal) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.goal = goal;
    }
    check() {
        if (this.name !== null && this.name !== "" && this.name !== undefined) {
            return true
        } else return false
    }
}

connectDB();


//localhost/

app.use('/', router);
app.use('/users', users);



//app.use('/users', users);
console.log("http://localhost:6000/users");
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
    /*
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
     */
});



module.exports = app;
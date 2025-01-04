let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
let connectDB = require('./controllers/dbManager')
let cors = require('cors')
let session = require('express-session')
let mongoSession = require('connect-mongo')

require('dotenv').config({path: path.join(__dirname, '.env')})

let index = require('./routes/index')
let users = require('./routes/users')
let cards = require('./routes/cards')
let quiz = require('./routes/quiz')
let dashboard = require('./routes/dashboard')

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const corsOptions = {
    origin: 'http://localhost:5173',  // Frontend URL (adjust this as necessary)
    credentials: true,  // Allow cookies/credentials
};
app.use(cors(corsOptions));

//Connecting database
connectDB()
    .then(() => console.log('MongoDB Atlas connected.'))
    .catch(err => {
        console.log("Mongo URI:", process.env.MONGO_URI)
        console.error('Database connection error:', err.message)
        process.exit(1) // Exit the app if unable to connect
    })

//configure session middleware
app.use(session({
    store: mongoSession.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 2 * 60 * 60, // 2 hours
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,                  //True forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false,       //A session is uninitialized when it is new but not modified
    cookie: {
        httpOnly: true, // Prevent access via JavaScript
        secure: false,
        maxAge: 2 * 60 * 60 * 1000, // hours * minutes * seconds * milliseconds = 2 hours
        sameSite: 'lax',
    }
}))

//localhost:3000/
app.use('/', index)

//localhost:3000/users
app.use('/users', users)

//localhost:3000/cards
app.use('/cards', cards)

//localhost:3000/quiz
app.use('/quiz', quiz)

//localhost:3000/dashboard
app.use('/dashboard', dashboard)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message, error: req.app.get('env') === 'development' ? err : {}
    })
    /*
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
     */
})


module.exports = app
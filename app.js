const express = require('express')
const app = express();
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');


//importing routes
const tasks = require('./routes/tasks')
const organizations = require('./routes/organizations')
const about_contact = require('./routes/about_contact')
const users = require('./routes/users')

//Database connection
const connectDB = require('./db/connect')

//Middleware folder imports 
const validateId = require('./middleware/paramValidate');
const notFound = require('./middleware/not_found')
const errorHandlerMiddleware = require('./middleware/error_handler')
const expressLayouts = require('express-ejs-layouts');
const authenticationMiddleware = require('./middleware/auth');
require('dotenv').config()

// Setting EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

//Parsing middleware
app.use(express.urlencoded({extended: true }));
app.use(express.json());

//Serving up static assets
app.use(express.static(path.join(__dirname, 'public'))); //serving up the static assets

//Layouts
app.use(expressLayouts);

//Establishing session middleware
app.use(session({
    secret: 'aa;ej;eif', // replace with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using https
  }));

//Setting up flash globally
app.use(flash());

//Setting user as a global variable
app.use((req, res, next) => {  
    res.locals.flashMessages = req.flash()
    if (req.session && req.session.demo_id) {
        const {name, demo_id}= req.session;
        res.locals.demo_id= demo_id;
        res.locals.name = name;

    } else {
        res.locals.name = null;
        res.locals.demo_id = null;

    }
    next();
});


//Public routes
app.get('/', (req,res)=>{
    res.status(200).render('about');
})

app.use('/', about_contact)
app.use('/', users)

//Authentication Middleware -> Important for Protected Routes
app.use(authenticationMiddleware)

//Protected Routes
app.use('/tasks',validateId, tasks);
app.use('/organizations', validateId, organizations);

//Error handling middlware
app.use(notFound)
app.use(errorHandlerMiddleware)

// Establishing the port
const port = process.env.PORT || 3000

// Starting server
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    }
    catch (error) {
        console.log(error)
    }
}

start()


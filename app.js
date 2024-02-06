const express = require('express')
const app = express();
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// HTTPS
const https = require('https');
const fs = require('fs');

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

app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
  

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

app.set('trust proxy', 1);
// Session middleware
app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
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

const start = async (retryCount = 5) => {
    try {
        await connectDB(process.env.MONGO_URI);

        // Check if running in development mode
        if (process.env.NODE_ENV === 'development') {
            // Load SSL certificate files for HTTPS
            const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
            const certificate = fs.readFileSync(path.join(__dirname, 'server.cert'), 'utf8');
            const credentials = { key: privateKey, cert: certificate };

            // Create HTTPS server for local development
            const httpsServer = https.createServer(credentials, app);
            httpsServer.listen(port, () => console.log(`HTTPS Server running on port ${port}...`));
        } else {
            // Fallback to regular HTTP server for production
            app.listen(port, () => console.log(`Server is listening on port ${port}...`));
        }
    } catch (error) {
        console.error(error);
        if (retryCount > 0) {
            console.log(`Retrying to connect to database... Attempts left: ${retryCount}`);
            setTimeout(() => start(retryCount - 1), 5000); // Retry after 5 seconds
        }
    }
};

start();


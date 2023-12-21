require('./db/connect')
const express = require('express')
const app = express();
const path = require('path');
app.set('view engine', 'ejs');

//importing routes
const tasks = require('./routes/tasks')
const organizations = require('./routes/organizations')


const connectDB = require('./db/connect')
const notFound = require('./middleware/not_found')
const errorHandlerMiddleware = require('./middleware/error_handler')
require('dotenv').config()


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));


//typical route
app.get('/', (req,res)=>{
    res.status(200).render('landing');
})


//Serving other routes
app.use('/', tasks)
app.use('/', organizations)

app.use(notFound)
app.use(errorHandlerMiddleware)


// app.get('/api/v1/tasks')
// app.post('/api/v1')

const port = process.env.PORT || 3000

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


const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const helmet = require('helmet');
const { ensureSecure } = require('./lib/common');

dotenv.config();

//Route Handlers
const authRoutes = require('./routes/auth-routes/auth-routes');
const userRoutes = require('./routes/user-routes/user-routes');
const blogRoutes = require('./routes/blog-routes/blog-routes');

//Enabling trust proxy
app.set('trust proxy',true);

//Set bodyParser and cors
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan());

//Setting up cookiesession 
app.use(cookieSession({    
    name: 'session',
    resave: true,
    saveUninitialized: false,
    secret: process.env.JWT_SECRET,
    keys: [process.env.JWT_SECRET]
}));

//During development phase not used cookie on http 
// app.use(cookieSession({
//     secret: process.env.JWT_SECRET,
//     httpOnly: true,
//     secure: true
// }));

app.use(helmet());

//Setting up access control of application
console.log('Setting up access contol of application ...');
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080/', 'https://pure-journey-50523.herokuapp.com/');
    res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PATCH', 'PUT');
    res.setHeader('Access-Control-Allow-Credentials',true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//check node version
const nodeVersionMajor = parseInt(process.version.split('.')[0].replace('v', ''));
if(nodeVersionMajor < 12){
    console.log(`Please use Node.js version 12.x or above. Current version: ${nodeVersionMajor}`);
    process.exit(2);
}

//During deployment phase
//Redirect http request to https
// app.get('*',(req, res, next) => {
//     ensureSecure(req, res, next);
//     next();
// });


app.use(authRoutes);
app.use(userRoutes);
app.use(blogRoutes);

//Handling routes that does not exist
app.use('*', (req, res) => {
    res.status(500).json({ message: 'No page with this request'});
});

module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const cors = require('cors');
const app = express();
const { getDb } = require('./config/db/db');

const authRoutes = require('./routes/auth-routes/auth-routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan());
app.use(cookieSession({
    name: 'session',
    keys: ['asdf123']
}));

app.use(authRoutes);

module.exports = app;
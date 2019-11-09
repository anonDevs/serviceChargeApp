const express = require('express');
const dotenv = require('dotenv');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const svcRouter = require('./routes/svcRouter');
const userRouter = require('./routes/userRouter');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const morgan = require('morgan');

dotenv.config({ path: `${__dirname}/config.env` });

// DB CONNECTION

require('./db');

// MORGAN

if (process.env.DEVELOPMENT_ENV === 'true') {
  app.use(morgan('dev'));
}

// CONFIGURATIONS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine(
  'hbs',
  handlebars({
    extname: 'hbs',
    partialsDir: path.join(__dirname, 'views/partials'),
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'default'
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(
  session({
    name: process.env.SESS_NAME,
    secret: process.env.SESS_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: true
    }
  })
);

app.use('/', svcRouter);
app.use('/', userRouter);

module.exports = app;

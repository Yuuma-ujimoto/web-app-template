const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require("express-session")


const indexRouter = require('./routes/index');
const sign_in_router = require("./routes/sign-in")
const sign_up_router = require("./routes/sign-up")
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly: true,
        secure: false,
        maxage: 1000 * 60 * 60 * 24 * 30
    }
}))

app.use('/', indexRouter);
app.use('/sign-up', sign_up_router);
app.use('/sign-in', sign_in_router);


app.listen(3000);

var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const debug = require("debug");

const cors = require("cors");
const csurf = require("csurf");
const { isProduction } = require("./config/keys");

require('./models/User');
require('./config/passport');
require('./models/Tweet');
const passport = require('passport');

var usersRouter = require("./routes/api/users");
var tweetsRouter = require("./routes/api/tweets");
const csrfRouter = require("./routes/api/csrf");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (!isProduction) {
    app.use(cors());
}

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true,
        },
    })
);

app.use("/api/users", usersRouter);
app.use("/api/tweets", tweetsRouter);
app.use("/api/csrf", csrfRouter);
app.use(passport.initialize());

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.statusCode = 404;
    next(err);
});

const serverErrorLogger = debug("backend:error");

// Express custom error handler that will be called whenever a route handler or
// middleware throws an error or invokes the `next` function with a truthy value
app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        statusCode,
        errors: err.errors,
    });
});

module.exports = app;

require("dotenv").config();
require('./config/passport');
const path = require("node:path");
const express = require("express");
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const routes = require('./routes');
const { pool } = require('./config/pool');
const { addAuthState } = require('./middleware/authMiddleware');
const pgSession = require('connect-pg-simple')(session);

const app = express();

app.use(session({
  store: new pgSession({
    pool : pool,
  }),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// Add auth state to all views
app.use(addAuthState);

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(routes);

app.listen(process.env.PORT, () => console.log("app listening on port: ", process.env.PORT));
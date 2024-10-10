if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}
// console.log(process.env) // remove this after you've confirmed it is working

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { isLoggedIn } = require("./middleware.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;


main()
  .then(() => {
    console.log("conection to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

app.get("/", (req, res) => {
  res.send("root is connected"); 
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  httpOnly: true,   //this is using for security purpose specially prevent the cross scripting attacks. not need to deep down in this topic acc to apna college.
        
  } 
};



app.use(session(sessionOptions));       //it is use because we use cookies.
app.use(flash());                       //it simply popup the altert part with user defined message like index deleted successful , or danger etc...
app.use(passport.initialize());
app.use(passport.session());   //this series of requests and responses,  each associated woth the same user is known session.

passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());        //Generates a function that is used in Passport's LocalStrategy
passport.deserializeUser(User.deserializeUser());   // Generates a function that is used by Passport to serialize users into the session

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
}); 

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);  
app.use("/", userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});
// //error handling
app.use((err, req, res, next) => {
  let { statuCode = 500, message = "something went wrong" } = err;
  res.render("listings/error.ejs", { message });
});

app.listen(8080, (req, res) => {
  console.log("root is listening");
});

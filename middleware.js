const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");
const Listing = require("./models/listing.js");

module.exports.isLogggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //save redirectUrl
    req.session.redirectUrl = req.originalUrl;   //req.session used because its value acccesible to everywhere.
    req.flash("error", "You must be logged in to create listing!");
    return res.redirect("/login");
  }
  next(); 
};

//save redirectUrl middleware
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};



//server side schema validation using joi.
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      return next(new ExpressError(400, error.details)); // Added proper error handling with details
    }
    next();
};
  

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return next(new ExpressError(400, error.details)); // Added proper error handling with details
    }
    next();
  };

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`listings/${id}`);
    }
    next();
};
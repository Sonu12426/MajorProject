const express = require("express");
const router = express.Router(); //creating a router object.
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLogggedIn, validateListing } = require("../middleware.js");
const Review = require("../models/reviews.js");
const {validateReview, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
// const upload = multer({ dest:' uploads/' });
const upload = multer({ storage });



//Index Route.
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLogggedIn,listingController.renderNewForm);

//Create Route.
router.post(
  // upload.single('listing[image]'), (res, req) => {
  //   console.log(req.file);
  // }
  "/", 
  isLogggedIn,
  upload.single("listing[image]"),
  validateListing, //validateListing is a middleware function which is responsible for the server side validation.
  wrapAsync(listingController.createLisitng)

);


// Show Route
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);


//Edit listing.
router.get(
  "/:id/edit",
  isLogggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//update listing
router.put(
  "/:id",
  isLogggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateLisitng)
);

//Delete listing.
router.delete(
  "/:id",
  isLogggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;

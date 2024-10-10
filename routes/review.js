const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const {validateReview, isOwner, isLogggedIn} = require("../middleware.js");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/review.js");


// Post Review Route
router.post(
  "/",
  isLogggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);


// Corrected delete route
router.delete(
  "/:reviewId",
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;

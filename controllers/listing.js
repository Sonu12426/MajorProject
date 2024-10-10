// const Listing = require("../models/listing");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createLisitng = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url," ",filename);
  const newListing = new Listing(req.body.listing);
  newListing.image = { url, filename };
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created Successfully!");
  res.redirect("/listings");
};



module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({              //nested populate.
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner") //populate se chainig kr karte hai
  if (!listing) {
    req.flash("error", "Listing you request for does not exist");
    res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "Listing Updated!");
  if (!listing) { 
    req.flash("error", "Listing you request for does not exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleted");
  res.redirect("/listings");
}
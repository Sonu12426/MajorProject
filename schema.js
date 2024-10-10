// const Joi = require('joi');

// //this code is for server-side validation.
// module.exports.listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         image: Joi.object({
//             filename: Joi.string().allow("", null),  // Fixed to expect object with filename
//             url: Joi.string().allow("", null)  // Fixed to expect object with url
//         }),
//         price: Joi.number().required().min(0),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//     }).required()
// });

// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.string().required(),
//         comment: Joi.string().required(),
//     }).required()
// });

// schema.js

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().allow("", null)
        }),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),  // Adjust as per your rating requirements
        comment: Joi.string().required()
    }).required()
});

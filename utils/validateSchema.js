const Joi = require('joi')

const validCampground = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
})

const validReview = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1),
        content: Joi.string().required()
    }).required()
})

const validUser = Joi.object({
    user: Joi.object({
        name: Joi.string().required().min(8).max(20),
        password: Joi.string().required().min(8).max(16),
        role: Joi.string().required()
    })
})

module.exports.validCampground = validCampground
module.exports.validReview = validReview
module.exports.validUser = validUser
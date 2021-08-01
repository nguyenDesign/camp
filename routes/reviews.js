const route = require('express').Router({mergeParams: true})
const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')
const User = require('../models/user')
const auth = require('../utils/auth')

//Prefix = /campground/:id/review
route.post('/', auth,async  (req,res)=>{
    let review = new Review(req.body.review)
    let author = await User.findById(req.cookies['id'])
    review.author = author
    let campground = await Campground.findById(req.params.id)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Thanks for your review')
    res.redirect(`/campgrounds/${req.params.id}`)
})

route.delete('/:id2', async (req,res)=>{
    await Campground.findByIdAndUpdate(req.params.id, {$pull:{reviews:req.params.id2}})
    await Review.findByIdAndDelete(req.params.id2)
    req.flash('success', 'Review deleted')
    res.redirect(`/campgrounds/${req.params.id}`)
})

module.exports = route
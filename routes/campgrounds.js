const route = require('express').Router({mergeParams: true})
const Campground = require('../models/campgrounds')
const wrapAsync = require('../utils/wrapAsync')
const validCampground = require('../utils/validateSchema').validCampground
const ExpressError = require('../utils/expressError')
const auth = require('../utils/auth')
const isAuthor = require('../utils/isAuthor')
const User = require('../models/user')
const CampgroundController = require('../controller/campgroundController')
let validateSchema = function(req,res,next){
    let {error} =  validCampground.validate(req.body)
    if (error){
        let msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

//Prefix = /campgrounds
route.route("/")
    .get(wrapAsync(CampgroundController.index))
    .post(validateSchema, wrapAsync (CampgroundController.createNewCamp))
route.get('/new', (req,res)=>{
    res.render('campgrounds/new')
})
route.get('/:id', wrapAsync(async (req,res)=>{
    let campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate:{
            path: "author"
        }
    }).populate("user")
    // In case user is deleted 
   
    let id = req.cookies['id'] // if user log in there will be a user name on the cookies
    let user = await User.findById(id)
    if (!campground){
        req.flash('error', 'Cannot find campground')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/show', {campground, user})
}))
route.get('/:id/edit', auth, isAuthor,wrapAsync (async (req,res)=>{
    let campground = await Campground.findById(req.params.id).populate("user")
    let user = req.cookies['user']
    res.render('campgrounds/edit', {campground, user})
}))

route.put('/:id', auth, isAuthor, validateSchema, wrapAsync(async (req,res)=>{
    await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground})
    req.flash('success', 'Success: Campground has been modified')
    res.redirect(`/campgrounds/${req.params.id}`)
}))

route.delete('/:id', wrapAsync(async (req,res)=>{
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', 'Success: Campground has been deleted')
    res.redirect('/campgrounds')
}))

module.exports = route
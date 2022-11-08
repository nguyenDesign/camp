const CampGround = require('../models/campgrounds')
const Campground = require("../models/campgrounds");

module.exports.index = async (req,res)=>{
    let campgrounds = await CampGround.find({})
    let name  = req.cookies['name']
    res.render('campgrounds/index',{campgrounds, name})
}

module.exports.createNewCamp = async  (req,res)=>{
    let campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'Success: Campground has been created')
    res.redirect('/campgrounds')
}
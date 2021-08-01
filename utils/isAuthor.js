const CampGround = require('../models/campgrounds')
const isAuthor = async function (req,res,next){
    const {id} = req.params
    let campground = await CampGround.findById(id).populate("user")
    let currentUser = req.user
    if (currentUser.id !== campground.user.id){
        req.flash('error', "You do not have permission to do this")
        res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports = isAuthor
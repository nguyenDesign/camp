const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CampGroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
})

CampGroundSchema.methods.findPrinceSimilar = async function (){
    const campgrounds = await Campground.find({price: this.price})
    return campgrounds
}

CampGroundSchema.statics.findPriceLessThan = async function (p){
    const campgrounds = await Campground.find({price: {$gte: p}})
    return campgrounds
}

const Campground = mongoose.model('Campground', CampGroundSchema)
module.exports = Campground
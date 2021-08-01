const {model,Schema} = require('mongoose')

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    location:String,
    description: String,
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

module.exports = model("Campground", campgroundSchema)
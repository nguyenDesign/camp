const {model,Schema} = require('mongoose')

const reviewSchema = new Schema({
    rating: Number,
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Review', reviewSchema)
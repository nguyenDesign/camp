const {model,Schema} = require('mongoose')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const userSchema = new Schema({
    name: {
        type:String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'customer']
    },
    tokens : [{
        token:{
            type: String,
            required: true
        }
    }]
})
//Schema.Static function can be invoked by Model, Schema.Method can be invoked by instance

//Hashing password before save
userSchema.pre('save', async function (next){
    let user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Use find by credentials
userSchema.statics.findByCredentials = async function(name,password){
    let user = await User.findOne({name})
    if (!user){
        throw new Error("Unable to find user with this name, login failed")
    }
    let isRight = bcrypt.compare(password, user.password)
    if (!isRight){
        throw new Error("Unable to log in: password is not correct")
    }
    return user
}

//Generate token
userSchema.methods.generateAuthToken = async function(){
    let user = this
    let token = JWT.sign({id: user._id.toString()}, 'user')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

const User = model('User', userSchema)

module.exports = User
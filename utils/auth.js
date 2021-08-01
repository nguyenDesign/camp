const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async function(req,res,next){
    try
    {
        req.session.redirectTo = req.originalUrl
        let token = req.cookies['auth-token']
        let decoded = jwt.verify(token, 'user')
        let user = await User.findOne({_id: decoded.id, 'tokens.token': token})
        if (!user) {
            throw new Error()
        }
        req.token = token
        next()
    }catch(e){
        res.status(401).redirect('/authentication/login')
    }
}

module.exports = auth
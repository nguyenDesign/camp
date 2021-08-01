const route = require('express').Router()
const User = require('../models/user')
const auth = require('../utils/auth')
const wrapAsync = require('../utils/wrapAsync')

route.get('/login', (req,res)=>{
    res.render('login')
})

route.post('/login', wrapAsync( async(req,res)=>{
    let {name, password} = req.body.user
    try{
        let user = await User.findByCredentials(name, password)
        let token = await user.generateAuthToken()
        res.cookie('auth-token', token)
        res.cookie('name', user.name)
        res.cookie('id', user._id)
        const redirectUrl = '/campgrounds';
        delete req.session.redirectTo;
        res.redirect(redirectUrl);
    }catch(err){
        req.flash('error', 'Incorrect password or username')
        res.redirect('/authentication/login')
    }

}))

route.get('/logout', wrapAsync(async(req,res)=>{
    let token = req.cookies['auth-token']
    let id = req.cookies['id']
    let user = await User.findById(id)
    try{
        user.tokens = []
        await user.save()
    }catch(e){
        res.status(500).send()
    }
    if (token && token.length > 1){
        const redirectUrl = req.session.redirectTo || '/campgrounds';
        delete req.session.redirectTo;
        res.clearCookie('auth-token')
        res.clearCookie('name')
        res.clearCookie('id')
        res.redirect(redirectUrl);

    }
}))

module.exports = route
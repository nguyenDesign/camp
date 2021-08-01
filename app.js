const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const authentication = require('./routes/authentication')
const ExpressError = require('./utils/expressError')
const session = require('express-session')
const flash = require('connect-flash')

const cookieParser = require('cookie-parser')
//.....Database......
require('./database/db')
//.....Database......

const PORT = 3000
const app = express()
app.set("view engine", "ejs")
app.set("views", path.join(__dirname,"views"))
app.engine('ejs', ejsMate)

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/authentication', express.static(path.join(__dirname, 'public')))
app.use('/campgrounds', express.static(path.join(__dirname, 'public')))

app.use(cookieParser())
app.get('/', (req, res) => {
    res.render('home')
})
let sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use((req,res,next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use('/authentication', authentication)
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.all('*', (req,res,next)=>{
    next(new ExpressError("Page not found", 404))
})
app.use((err,req,res,next)=>{
    const {statusCode = 500} = err
    if (!err.message) err.message = 'Oh No! Something went wrong'
    res.status(statusCode).render('error', {err})
})
app.listen(PORT, ()=>{
    console.log("server started at port " + PORT)
})
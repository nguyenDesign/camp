const express = require('express')
const mongoose = require('mongoose')
const CampGround = require('./models/campgrounds')
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const ExpressError = require('./utills/ExpressError')
const wrapAsync = require('./utills/wrapAsync')
const campgroundSchema = require('./schema')


app = express()
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useUnifiedTopology: true, useNewUrlParser:true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function (){
    console.log('CONNECTION OPEN!!!')
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

// error handler server side
const campgroundSchemaValidate = function (req,res,next){

    const {error} = campgroundSchema.validate(req.body)
    if (error){
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(msg, 400)
    }else{
        next()
    }

}

// home page
app.get('/', (req, res) =>{
    res.send('Home')
})

// get all the campgrounds and show
app.get('/campgrounds', wrapAsync(async (req,res)=>{
    const campgrounds = await CampGround.find({})
    if (!campgrounds){
        throw new ExpressError('Do not have any campgrounds', 404)
    }
    res.render("campgrounds/index", {campgrounds})
}))

// create a new campground
app.post('/campgrounds',campgroundSchemaValidate, wrapAsync(async (req,res)=>{

    const campground = new CampGround(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

// access to the form to create new campground
app.get('/campgrounds/new',(req, res)=>{
    res.render('campgrounds/new')
})

// get a campground by id and show
app.get('/campgrounds/:id', wrapAsync(async (req, res) =>{
    const campground = await CampGround.findById(req.params.id)
    res.render('campgrounds/show', {campground})
}))

// show a form to edit a campground
app.get('/campgrounds/:id/edit', wrapAsync(async (req, res)=>{
    const campground = await CampGround.findById(req.params.id)
    res.render('campgrounds/edit', {campground})
}))

app.put('/campgrounds/:id',campgroundSchemaValidate, wrapAsync(async (req, res)=>{
    const id = req.params.id
    await CampGround.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id', wrapAsync(async (req, res)=>{
    const id = req.params.id
    await CampGround.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.all('*', (req,res,next) =>{
    next (new ExpressError("Page not found!", 404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err
    if (!err.message) {
        err.message = "Oh No, something went wrong"
    }
    res.status(statusCode).render('error', {err})
})

app.listen(3000, ()=>{
    console.log("Server started")
})

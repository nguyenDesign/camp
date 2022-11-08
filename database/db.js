const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
    console.log("Database connect")
}).catch(err=>{
    console.log('Connect error')
    throw err
})
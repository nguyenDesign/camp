require('./database/db')
const Campground = require('./models/campgrounds')
const User = require('./models/user')
sampleCity = ["Ho Chi Minh", "Ha Noi", "Da Nang", "Can Tho"]
sampleDistrict = ["District 1", "District 2", "District 3", "District 4"]
let updateAll = async function(){
    let campgrounds = await Campground.find({})
    for (const camp of campgrounds){
        camp.user = "609e6ea6aaa258120105178b"
        await camp.save()
    }
}
let initialDB = async function () {
    let newCampground;
    for (let i = 0; i < 10; i++) {
        let dist = sampleDistrict[Math.floor(Math.random() * sampleDistrict.length)]
        let city = sampleCity[Math.floor(Math.random() * sampleCity.length)]
        newCampground = new Campground({
            title: `Campground number ${i}`,
            location: `${dist}, ${city}`,
            image:'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price: Math.floor(Math.random()*100),
            review: []
        })
        await newCampground.save()
    }
}
let initialUser = async function(req,res){
    let user = new User({
        name: 'myadmin',
        password: 'myadmin'
    })
    await user.save()
}
// initialDB().then(()=>{console.log("Successfully Initialize database")}).catch(err=>{
//     console.log("Error when initial database")
//     throw err
// })
// initialUser().then(()=>{})

updateAll().then(()=>{})
const mongoose = require('mongoose')
const CONNECTION_URL = "mongodb://hohainguyen:bedhgzE3lHQx8QKrrf2l5YlzDPTPj7zaBLUm0b4hJTSzXvjK3ziWqaGzr4sIk8dykppP1ElQs7mrACDbiEui5w==@hohainguyen.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@hohainguyen@"
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
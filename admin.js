var mongoose = require('mongoose')
// add .env file config
require("dotenv/config")

mongoose.connect(process.env.DB_CONNECTION,{ useUnifiedTopology: true,useNewUrlParser: true },function () {
    console.log("connect DB!")
  })

var Schema = mongoose.Schema

var userSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    userid: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      // 0 negative
      // 1 positive
      // 2 recover
      enum: [0, 1, 2],
      default: 0
    },
    userType: {
      // 0 normal user
      // 1 admin account
      type: Number,
      enum: [0, 1],
      default: 0
    }
  })

// var userCollection = mongoose.model('User', userSchema)

// var dataSchema = new mongoose.Schema({})
// var testCollection = mongoose.model('testmodel', dataSchema, 'test')

// testCollection.findOne({
//   $or: [{
//         cola: "a"
//     },
//     {
//         colb: "b"
//     }
// ]
// }, function (err, data) {
//   if (err)  {
//     console.log("error test")
//   }

//   console.log(data)
// })



// module.exports = {
//   userCollection,
//   testCollection
// }
module.exports = mongoose.model('Admin', userSchema)

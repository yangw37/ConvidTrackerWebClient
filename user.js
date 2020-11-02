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


module.exports = mongoose.model('User', userSchema)

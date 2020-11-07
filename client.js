var mongoose = require('mongoose')
// add .env file config
require("dotenv/config")

mongoose.connect(process.env.DB_CONNECTION,{ useUnifiedTopology: true,useNewUrlParser: true },function () {
    console.log("connect DB!")
  })


var clientSchema = new mongoose.Schema({})
var clintCollection = mongoose.model('clientModel', clientSchema, 'User')

// clintCollection.findOne({
//   $or: [{
//         client_mac: "1A:2B:3C:4D:5E:6F"
//     }
// ]
// }, function (err, data) {
//   if (err)  {
//     console.log("error test")
//   }

//   console.log(data)
// })

// export User collections
module.exports = clintCollection


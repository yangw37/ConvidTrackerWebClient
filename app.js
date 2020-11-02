var express = require("express")
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var router = require('./router')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
app.use('/vendors/', express.static(path.join(__dirname, './vendors/')))
app.use('/build/', express.static(path.join(__dirname, './build/')))


// art template
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认就是 ./views 目录


// 配置解析表单 POST 请求体插件（注意：一定要在 app.use(router) 之前 ）
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'itcast',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
  }))



// load router
app.use(router)


app.listen(3000, function () {
  console.log('running 3000...')
})

module.exports = app

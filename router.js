
var express = require('express')
var Admin = require('./admin')
var router = express.Router()

router.get('/', function(req, res){
    res.render("index.html", {
        admin: req.session.admin
    })
})

router.get('/register', function (req, res) {
    res.render('register.html')
  })

router.post('/register', function (req, res) {
    var body = req.body
    console.log(body)

    Admin.findOne({
        $or: [{
                email: body.email
            },
            {
                userid: body.userid
            }
        ]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }

        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or userid aleady exists.'
            })
        }

        new Admin(body).save(function (err, admin) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Internal error.'
                })
            }


            req.session.admin = admin
            console.log("here")
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })
    })
})


router.get('/login', function (req, res) {
    res.render('login.html')
})

router.post('/login', function (req, res) {
    // 1. 获取表单数据
    // 2. 查询数据库用户名密码是否正确
    // 3. 发送响应数据
    console.log("try to login")
    var body = req.body
  
    Admin.findOne({
       email: body.email,
       password: body.password
    }, function (err, admin) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: err.message
            })
        }
      
      // 如果邮箱和密码匹配，则 admin 是查询到的用户对象，否则就是 null
        if (!admin) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            })
        }
  
      // 用户存在，登陆成功，通过 Session 记录登陆状态
        req.session.admin = admin
  
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})

router.get('/logout', function (req, res) {
    // 清除登陆状态
    req.session.admin = null
  
    // 重定向到登录页
    res.redirect('/login')
})


module.exports = router

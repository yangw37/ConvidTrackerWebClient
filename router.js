
var express = require('express')
var Admin = require('./admin')
var Client = require('./client')
var router = express.Router()

router.get('/recordv2', function(req, res) {
    res.render("recordv2.html", {
        admin: req.session.admin
    })
})

router.post('/recordv2', function(req, res){
    var body = req.body
    
    Client.findOne({
        $or: [{
            client_mac: body.macAddress
        }]
    }, function (err, data){
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Server error'
            })
        }
        if (data) {
            // update status
            data.status = body.status

            Client.findByIdAndUpdate(data._id, data, {new: true}, function (err, ret) {
                if (err) {
                    return res.status(500).json({
                        err_code: 500,
                        message: 'Internal error.'
                    })
                } else {
                    res.status(200).json({
                        err_code: 0,
                        message: 'OK'
                    })
                }
            })
        }

        if (!data){
            return res.status(200).json({
                err_code: 1,
                message: 'Mac Address Does Not Exists.'
            })
        }
    })
})

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

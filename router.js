
var express = require('express')
var Admin = require('./admin')
var Client = require('./client')
var sd = require('silly-datetime')
var router = express.Router()

router.get('/getGraphData', function(req, res) {
    return res.status(200).json({
        labelsVal: [1750,1800,1850,1900,1950,1999,2050],
        dataOne: [106,107,111,133,221,783,2478],
        dataTwo: [502,635,809,947,1402,3700,5267]
    })
})

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
            data.last_modify_time = sd.format(new Date(), 'YYYY-MM-DD')
            // data.last_modify_time = new Date()

            // data.modifier = req.session.admin
            Admin.findById(req.session.admin, function(err, adminData){
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Server error'
                    })
                }
                if (adminData) {
                    console.log(adminData.userid)
                    data.modifier = adminData.userid
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
    var dateTime=new Date()
    // console.log(dateTime)
    // console.log(dateTime.setDate(dateTime.getDate()+1))
    // console.log(sd.format(dateTime, 'YYYY-MM-DD HH:mm:ss'))
    // console.log(sd.format(dateTime.setDate(dateTime.getDate()+1), 'YYYY-MM-DD HH:mm:ss'))

    var start = sd.format(dateTime, 'YYYY-MM-DD')
    console.log(start)

    Client.find(
        {"last_modify_time": start}, function(err, data){
            if (err) {
                res.render("index.html", {
                    admin: req.session.admin,
                    logs: []
                })
            }

            if (data) {
                var logsArray = []
                for (i = 0; i < data.length; i++) {
                    logsArray.push({
                        name: data[i].modifier,
                        modifyTime: sd.format(data[i].last_modify_time, 'YYYY-MM-DD'),
                        client_mac: data[i].client_mac,
                        status: data[i].status
                    })
                }
                res.render("index.html", {
                    admin: req.session.admin,
                    logs: logsArray
                })
            }
            console.log(data)
        })
    
    // res.render("index.html", {
    //     admin: req.session.admin,
    //     logs: [
    //         {
    //             name: "Austin",
    //             sex: "male"
    //         },
    //         {
    //             name: "Justin",
    //             sex: "male"}]
    // })
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

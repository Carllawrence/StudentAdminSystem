var express = require('express');
var router = express.Router();
var passport = require('passport');
//setup email service
var email = require("emailjs");

var server = email.server.connect({
    user: 'iprceastsys@gmail.com',
    password: 'iprceast123',
    host: 'smtp.gmail.com',
    ssl: true
}, function (err, message) {
console.log(err || message);
});

//require user schema
var User = require('../models/user.js');
var Event = require('../models/event.js');
var application = require('../models/application.js');
var payslips = require('../models/payslip.js');
var notices = require('../models/notify.js');
var mails = require('../models/mail.js');

//register user and login
router.post('/register', function (req, res) {
    User.register(new User({ username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, picUrl: req.body.picUrl, status: req.body.status }),
        req.body.password, function (err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
            passport.authenticate('local')(req, res, function () {

                if (!err) {
                    server.send({
                        text: "Your IPRC East account has been created. Your username is " + req.body.username,
                        from: 'IPRC System Admin',
                        to: req.body.username,
                        cc: 'carl.lawrence@live.com',
                        subject: "Account Created"
                    }, function (err, message) {
                        console.log(err || message);
                    });
                }

                return res.status(200).json({
                    status: 'Registration successful!'
                })

            });
        });
});

router.get('/createsuperuser', function (req, res) {
    User.register(new User({ username: 'sysadmin@iprceast.ac.rw', firstname: 'System', lastname: 'Admin', picUrl: 'userprofile.png', status: 5 }),
        'Jamaica62', function (err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
           
        });
});

router.get('/createadmin', function (req, res) {
    User.register(new User({ username: 'john.doe@iprceast.ac.rw', firstname: 'John', lastname: 'Doe', picUrl: 'userprofile.png', status: 3 }),
        'Jamaica62', function (err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
           
        });
});

// user login
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }


        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
            if (req.body.rememberMe) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
            } else {
                req.session.cookie.expires = false; // Cookie expires at end of session
            }
            res.status(200).json({
                status: 'Login successful!'
            });
        });
    })(req, res, next);
});



// user logout
router.get('/logout', function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'You have logged out!',

    });
});

//check authenticated status
router.get('/status', function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            status: false
        });
    }
    res.status(200).json({
        status: true
    });
});

router.get('/profile', function (req, res) {
    return res.send(req.isAuthenticated() ? req.user : '0');
});

router.get('/users', function (req, res) {
    if (req.isAuthenticated()) {
        User.find({}, function (err, users) {
            res.send(users);
        });
    } else {
        console.log('not authenticated');
    }
});

//get all users
router.get('/usersList', function (req, res) {
    User.find({}, function (err, users) {
        res.send(users.reduce(function (userMap, item) {
            userMap[item.id] = item;
            return userMap;
        }, {}));
    });
});

//super user remove user
router.delete('/remove', function (req, res) {
    console.log(req.body.id);
    user.findByIdAndRemove({ username: req.body.id }, function (err) {
        if (err) throw err;

        // we have deleted the user
        console.log('User deleted!');
    });
})

//super user create user
router.post('/createUser', function (req, res) {
    User.register(new User({ username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, picUrl: req.body.picUrl, status: req.body.status }),
        req.body.password, function (err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
        });
})

//user reset api route + uuid
router.get('/reset/:uuid', function (req, res) {
    //find user with uuid in route params
    User.findOne(req.params, function (error, user) {
        //if no user by that id
        if (error || !user) {
            res.send({
                status: 401,
                success: false
            });
        } else {
            return res.send({
                success: true,
                user: user
            });
        }
    });
})

//reset password of user
router.post('/reset', function (req, res) {
    //find the user by user uuid
    User.findOne({
        uuid: req.body.uuid
    }, function (err, user) {
        if (err) return handleError(err);
        user.setPassword(req.body.password, function (err) {
            if (err) return handleError(err);
            //change uuid to null if successful
            user.uuid = '';
            user.save();
            return res.send({
                success: true
            });
        });

    });
})

//change password
router.post('/changepassword', function (req, res) {
    //find the user
    if (req.body.username) {
        //if user is logged in
        User.findByUsername(req.body.username, function (err, user) {
            //no user found
            if (user === null) {

                return res.send({
                    success: false,
                    message: "cannot change password if you are not logged in"
                });
            } else {
                user.setPassword(req.body.password, function (err) {
                    if (err) return handleError(err);
                    user.save();
                    return res.send({
                        success: true
                    });
                });
            }
        });
    }
})

//forgot password
router.post('/forgot', function (req, res) {
    if (req.body.username) {
        //find id that belongs to the user and send it along
        User.findByUsername(req.body.username, function (err, user) {
            //no user found
            if (user === null) {
                return res.send({
                    success: false,
                    message: "no user with that e-mail address"
                });
            } else {

                //set the password token
                var guid = require('node-uuid');
                user.uuid = guid.v1();
                user.save(function (err) {
                    if (!err) {
                        console.log("updated");
                    } else {
                        console.log(err);
                    }
                    //return res.send(user);
                });


                // send the message and get a callback with an error or details of the message that was sent
                // this is a link to a password reset page
                server.send({
                    text: "Please click this link to reset your password: http://192.168.9.182:3001/#/reset/" + user.uuid,
                    from: 'IPRC System Admin',
                    to: req.body.username,
                    cc: 'carl.lawrence@live.com',
                    subject: "Password reset"
                }, function (err, message) {
                    console.log(err || message);
                });
                console.log("e-mail sent");
                //email sent??
                return res.send({
                    success: true,
                    message: "reset message sent!"
                });

            }
        });
    }

})

events = require('./eventsCRUD.js');

// Server API Routes
router.param('eventId', events.event);

router.post('/events', events.create);
router.get('/events', events.query);
router.get('/events/:eventId', events.show);
router.put('/events/:eventId', events.update);
router.delete('/events/:eventId', events.remove);

users = require('./userCRUD.js');

// Server API Routes
router.param('userId', users.user);

router.post('/appusers', users.create);
router.get('/appusers', users.query);
router.get('/appusers/:userId', users.show);
router.put('/appusers/:userId', users.update);
router.delete('/appusers/:userId', users.remove);

applications = require('./applicationCRUD.js');
// Server API Routes
router.param('applicationId', applications.application);

router.post('/applications', applications.create);
router.get('/applications', applications.query);
router.get('/applications/:applicationId', applications.show);
router.put('/applications/:applicationId', applications.update);
router.delete('/applications/:applicationId', applications.remove);

payslips = require('./payslipCRUD.js');
// Server API Routes
router.param('payslipId', payslips.payslip);

router.post('/payslips', payslips.create);
router.get('/payslips', payslips.query);
router.get('/payslips/:payslipId', payslips.show);
router.put('/payslips/:payslipId', payslips.update);
router.delete('/payslips/:payslipId', payslips.remove);

notices = require('./notifyCRUD.js');
// Server API Routes
router.param('noticeId', notices.notice);

router.post('/notices', notices.create);
router.get('/notices', notices.query);
router.get('/notices/:noticeId', notices.show);
router.put('/notices/:noticeId', notices.update);
router.delete('/notices/:noticeId', notices.remove);

mails = require('./mailCRUD.js');
// Server API Routes
router.param('mailId', mails.mail);

router.post('/mails', mails.create);
router.get('/mails', mails.query);
router.get('/mails/:mailId', mails.show);
router.put('/mails/:mailId', mails.update);
router.delete('/mails/:mailId', mails.remove);



module.exports = router;
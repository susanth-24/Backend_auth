var express = require('express');
var router = express.Router();
var User = require('../models/user');
var datalink = require('../models/datalink');
const { json } = require('body-parser');
//var din = [];
var ban=[];

//var newlink = [];

router.get('/', function (req, res, next) {
    //console.log(req.session.loggedin)
    datalink.find(function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            User.findOne({ unique_id: req.session.userId }, function d(err, data1)
            {
                if(data1){
                    console.log(data1+"h");
                      return res.render('home.ejs', {  docs: docs, temp : data1});
                      
                }else{
                    return res.render('home.ejs', {  docs: docs, temp : false});
                }
            })
        }
    });


});


//console.log(newlink);
router.get('/index', function (req, res, next) {
    return res.render('index');
});


router.post("/index", function (req, res, next) {
    console.log(req.body);
    var personInfo = req.body;


    if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
        res.send();
    } else {
        if (personInfo.password == personInfo.passwordConf) {

            User.findOne({ email: personInfo.email }, function (err, data) {
                if (!data) {
                    var c;
                    User.findOne({}, function (err, data) {

                        if (data) {
                            console.log("if");
                            c = data.unique_id + 1;
                        } else {
                            c = 1;
                        }

                        var newPerson = new User({
                            unique_id: c,
                            email: personInfo.email,
                            username: personInfo.username,
                            password: personInfo.password,
                            passwordConf: personInfo.passwordConf
                        });

                        newPerson.save(function (err, Person) {
                            if (err)
                                console.log(err);
                            else
                                console.log('Success');
                        });

                    }).sort({ _id: -1 }).limit(1);
                    res.send({ "Success": "You are regestered,You can login now." });
                } else {
                    res.send({ "Success": "Email is already used." });
                }

            });
        } else {
            res.send({ "Success": "password is not matched" });
        }
    }
});

router.get('/login', function (req, res, next) {
    return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
    //console.log(req.body);
    User.findOne({ email: req.body.email }, function (err, data) {
        if (data) {

            if (data.password == req.body.password) {
                //console.log("Done Login");
                req.session.userId = data.unique_id;
                //console.log(req.session.userId);
                res.send({ "Success": "Success!" });
                
                req.session.loggedin = true;
                res.locals.loggedin=req.session.loggedin;
                console.log(req.session);
            } else {
                res.send({ "Success": "Wrong password!" });
            }
        } else {
            res.send({ "Success": "This Email Is not regestered!" });
        }
    });
});

router.get('/profile', function (req, res, next) {
    console.log("profile");
    console.log(req.session.userId );
    User.findOne({ unique_id: req.session.userId }, function (err, data) {
        console.log("data");
        console.log(data);
        if (!data) {
            res.redirect('/');
        } else {
            //console.log("found");
            //din.push("hello");
            datalink.find({nameup:data.username},function(err,datsa)
            {
                console.log(datsa);
                console.log(data.username);
                return res.render('data.ejs', { "name": data.username, "email": data.email, d:datsa });
            })
           

        }
    });
});
router.post('/profile', function (req, res) {
    const data = {
        tag: req.body.newtitle,
        link: req.body.newlink
    };
    console.log(data);

    User.findOne({ unique_id: req.session.userId }, function d(err, data1) {


        console.log(data1.username);
        let d = data1.username;
        var newdatalink = new datalink({
            //id: c,
            nameup: d,
            tag: req.body.newtitle,
            link: req.body.newlink
        });
        newdatalink.save();
    });
    res.redirect('/');

});

datalink.find(function (err, docs) {
    if (err) {
        console.log(err);
    }
    else {
        /*console.log(fruits);*/

        //mongoose.connection.close();
        docs.forEach(function (doc) {
            console.log(doc.tag);
        });
    }
})

router.get('/logout', function (req, res, next) {
    console.log("logout")
    //din.splice(0,din.length);
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

router.get('/forgetpass', function (req, res, next) {
    res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
    //console.log('req.body');
    //console.log(req.body);
    User.findOne({ email: req.body.email }, function (err, data) {
        console.log(data);
        if (!data) {
            res.send({ "Success": "This Email Is not regestered!" });
        } else {
            // res.send({"Success":"Success!"});
            if (req.body.password == req.body.passwordConf) {
                data.password = req.body.password;
                data.passwordConf = req.body.passwordConf;

                data.save(function (err, Person) {
                    if (err)
                        console.log(err);
                    else
                        console.log('Success');
                    res.send({ "Success": "Password changed!" });
                });
            } else {
                res.send({ "Success": "Password does not matched! Both Password should be same." });
            }
        }
    });

});

module.exports = router;
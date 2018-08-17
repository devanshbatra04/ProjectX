const express                = require('express'),
    mongoose                 = require("mongoose"),
    passport                 = require('passport'),
    bodyParser               = require('body-parser'),
    localStrategy            = require('passport-local'),
    passportLocalMongoose    = require('passport-local-mongoose');

var User = require('./models/user'),
    Product = require('./models/products');

mongoose.connect("mongodb://lifeisgood:lifeisgood123@ds125402.mlab.com:25402/lifeisgood");


var app = express();
app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


app.use(require("express-session")({
    secret: "Please work this time",
    resave : false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/////////////////////////////////////// ROUTES//////////////////////////////////////////////////////////

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/check", function(req,res){
    res.render("home");
});


app.get("/", function(req,res){

    Product.find({featured: true}, function(err, Products){
        if (err) res.send(err);
        console.log(Products);
        res.render("index", {a:5, featuredProducts: Products });

    });

});


app.get("/shop", function(req,res){

    Product.find({}, function(err, Products){
        if (err) res.send(err);
        console.log(Products);
        res.render("shop", {a:5, Products });

    });

});

app.get("/products", function(req, res){
    Product.find({}, function(err,products){
        if (err) res.send(err);
        else res.send(products);
    })
})

app.post("/register", function(req,res){
    User.register(new User({
        username : req.body.username,
        email : req.body.email,
        name: req.body.name,
        phoneNumber: req.body.phone
    }), req.body.password, function(err, user){
        if (err){
            console.log(err);
            res.render('register');
        }
        else {
            console.log("user registered");
            passport.authenticate("local")(req,res, function(){
                res.redirect("secret");
            })
        }
    });
    console.log("Posted");
});

app.post('/api/login', function(req,res){
    console.log(req.body);
    passport.authenticate("local")(req,res, function(){
        res.status(200).send(req.user);
    })

});

app.post("/api/register", function(req,res){
    console.log(req.body);
    User.register(new User({
        username : req.body.username,
        email : req.body.email,
        name: req.body.name,
        phoneNumber: req.body.phone,
        MobVerified: false,
        OTP : Math.floor(Math.random() * 100000)
    }), req.body.password, function(err, user){
        if (err){
            res.status(400).send(err);
        }
        else {
            console.log("user registered");
            passport.authenticate("local")(req,res, function(){
                // sendSMS(req.user.phoneNumber, req.user.OTP);
                res.status(200).send(req.user);
            })
        }
    });
});

app.get("/secret", function(req,res){
    res.render("secret");
});

app.get("/login", function(req,res){
    res.render('login');
});

app.post('/login', passport.authenticate("local", {
    successRedirect : "/secret",
    failureRedirect: "/login"
}),function(req,res){

});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

app.get("/product/:id", function(req, res){
    Product.findById('5b7741471f6e4f589bbc9861', function(err, product ){
        if (err) res.send(err);
        else {
            console.log(product);
            res.render('productView', {product});

        }
    })
});

app.get("/checkout", function(req, res){
    res.render('checkout');
})

function ensureLoggedIn() {
    return function(req, res, next) {
        // isAuthenticated is set by `deserializeUser()`
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            req.session.returnTo = req.path;
            res.redirect("/login");
        } else {
            next()
        }
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var port = process.env.PORT || 5000;


app.listen(port, function(){
    console.log("Running on port " + port);
});

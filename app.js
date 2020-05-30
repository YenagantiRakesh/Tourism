var express             =require("express"),
    app                 =express(),
    bodyParser          =require("body-parser"),
    methodOverride      =require("method-override"),
    mongoose            =require("mongoose"),
    flash               =require("connect-flash"),
    passport            =require("passport"),
    LocalStrategy       =require("passport-local"),
    Campground          =require("./models/campgrounds"),
    Comment             =require("./models/comments"),
    User                =require("./models/user");
   
var commentRoutes    = require("./routes/comments"),
    reviewRoutes     = require("./routes/reviews"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require('moment');

mongoose.connect("mongodb://localhost/yelpdb",{ useNewUrlParser: true ,useUnifiedTopology: true});

//passport configuration:

app.use(require("express-session")({
    secret:"yelpcamp",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

//Requiring Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);



app.listen(3000,function(){
    console.log("Server is Running !!");
});
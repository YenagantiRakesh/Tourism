var express=require("express");
var router=express.Router();
var passport=require('passport');
var User=require("../models/user");

//root
router.get("/",function(req,res){
    res.render("landing");
});


//=================//
//Auth routes
//================//


//Register -form
router.get("/register",function(req,res){
    res.render("register",{page:"register"});
});

//Handle signup Logic
// router.post("/register",function(req,res){
//     User.register(new User({username:req.body.username}),req.body.password,function(err,user){
//         if(err){
//             req.flash("error",err.message);
//             return res.render("register");
//         }
//         passport.authenticate("local")(req,res,function(){
//             req.flash("success","Welcome to Yelpcamp"+user.username);
//             res.redirect("/campgrounds");
//         });
//     });
// });
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});

//Login - form
router.get("/login",function(req,res){
    req.flash("sucess","Successfully Logged in")
    res.render("login",{page:"login"});
});

//Login logic
router.post("/login",passport.authenticate("local",
{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){

});

//Logout
router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","Logged you out");
    res.redirect("/campgrounds");
});


module.exports=router;

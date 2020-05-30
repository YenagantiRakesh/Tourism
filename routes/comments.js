
var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campgrounds");
var Comment=require("../models/comments");
var middleware=require("../middleware");

//Comments new :

router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.render("comments/new",{campground:campground});
        }
    })
});


//Comments create
router.post("/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            req.flash("error","Something went wrong!");
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    res.redirect("/campgrounds");
                }else{
                    //add useraname and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();

                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added the comment !");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

//edit
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});   
        }
    });
   
});

//update

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//Destroy

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment has been successfully deleted");
            res.redirect("/campgrounds/"+req.params.id); 
        }
    });
});





module.exports=router;

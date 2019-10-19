//=====================
//COMMENTS ROUTES
//=====================
var express 	= require("express");
var router 		= express.Router({mergeParams: true});
var Campground 	= require("../models/campground");
var Comment 	= require("../models/comment");
var middleware 	= require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	})
	
});

//POST ROUTE
router.post("/", middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err);
			redirect("/campgrounds");
		} else {
			console.log(req.body.comment);
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					console(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			})

		}
	})
});

//GET ROUTE TO EDIT COMMENTS
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
		}
	});
});

//UPDATE ROUTE TO EDIT COMMENTS
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment)=>{
		if(err){
			console.log("Update Comment Fail");
			res.redirect("back");
		} else {
			console.log("Comment updated");
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});

//DESTROY ROUTE TO DELETE COMMENTS
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			console.log("Delete Comment Failed");
			redirect("back");
		} else {
			console.log("Deleted Comment");
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});

module.exports = router;
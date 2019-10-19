//all the middleware goes here
//MIDDLEWARE
var middlewareObj 	= {};
var Campground 		= require("../models/campground");
var Comment 		= require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	req.flash("error", "Please Login First");
	res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground)=>{
			if(err){
				console.log(err);
				res.redirect("back");
			} else {
				//does user own the campground
				if(foundCampground.author.id.equals(req.user._id)){
					console.log("i am here");
					return next();
				}
				req.flash("error", "You cannot do that. Not your post");
				res.redirect("back");
			}
		})
	} else {
		req.flash("error", "You need to login first")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
			if(err){
				console.log("cannot find comment id");
				res.redirect("back");
			} else {
				//Check whether the loggedInUser owns the comment
				if(foundComment.author.id.equals(req.params.id)){
					return next();
				} else {
					req.flash("error", "You cannot do that. Not your post");
					res.redirect("back");
				}
			}
		})
	} else {res.redirect("back"); }
};

module.exports = middlewareObj;

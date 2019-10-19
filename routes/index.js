//=============
//INDEX ROUTES
//=============

var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
var User 		= require("../models/user");

//HOME INDEX ROUTE
router.get("/", (req,res)=>{
	res.render("landing");
});

//============
// AUTH ROUTES
//============
//show register form
router.get("/register", (req, res)=>{
	res.render("register")
})

//sign up POST route
router.post("/register", (req, res)=>{
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			console.log(err);
			req.flash("error",err.message);
			res.redirect("back");
		} else {
			passport.authenticate("local")(req, res, function(){
				res.redirect("/campgrounds");
			})
		}
	})
});

//login route
router.get("/login", (req,res)=>{
	res.render("login");
})

//Login Post Route
router.post("/login", passport.authenticate("local",
 	{	
 		successRedirect: "/",
 		successFlash: "You are logged in!",
 		failureRedirect: "/login",
 		failureFlash : "Invalid username or password"
 	}), (req, res)=>{
	
});

//Logout Route
router.get("/logout", (req,res)=>{
	console.log("User Logout");
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	res.redirect("/login");
}

module.exports = router;


//===================
// CAMPGROUNDS ROUTES
//===================
var express = require("express");
var router	= express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX ROUTES FOR /campgrounds
router.get("/", (req, res)=>{
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campGrounds: allCampgrounds, currentUser: req.user});
		}
	})
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res)=>{
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: description, author: author};
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds")
		}
	})
});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res)=>{
	res.render("campgrounds/new");
});

//SHOW ROUTE
router.get("/:id", (req, res)=>{
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})
	
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{
			res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		if(err){
			res.redirect("/campgrounds");
		} else {
			//redirect to show page 
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;
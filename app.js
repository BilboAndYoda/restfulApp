var express = require("express"),
    app = express(),
    request = require('request'),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser")

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//MODEL/MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Dog",
//     image: "",
//     body: "body",
// });
//ROUTES
app.get("/", function(req, res) {
    res.redirect('/blogs');
});

//create
app.get("/blogs/new", function(req, res) {
    res.render('new');
});
app.post("/blogs", function(req, res) {
    //create blog
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/blogs");
        }
    });
});
//edit
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        }
        else {
            res.render("edit", { blog: blog });
        }
    });
});
//update route
app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//show all
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { blogs: blogs });
        }
    });
});
//show one
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("show", { blog: blog });
        }
    });
});
//DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs");
        }
    });
});











app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!!!");
});

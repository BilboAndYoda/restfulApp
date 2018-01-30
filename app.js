var express = require("express"),
    app = express(),
    request = require('request'),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser = require("body-parser")

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(expressSanitizer());
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

//SCHEMA
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Dog",
//     image: "https://images.unsplash.com/photo-1508280756091-9bdd7ef1f463?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=88fe1df3546c284d5ce36153fb0c97e7&auto=format&fit=crop&w=1390&q=80",
//     body: "Lorem ipsum dolor amet helvetica raw denim cliche selfies taxidermy fam. Edison bulb enamel pin chambray fixie, vinyl salvia wolf. Ennui keytar scenester, cred mumblecore fam sriracha small batch waistcoat bushwick migas meggings af bitters retro. Hell of flannel waistcoat organic, yr pug plaid squid thundercats migas pork belly intelligentsia.Oh. You need a little dummy text for your mockup? How quaint. I bet you’re still using Bootstrap too…",
// });

//ROUTES
app.get("/", function(req, res) {
    res.redirect('/blogs');
});

//CREATE
app.get("/blogs/new", function(req, res) {
    res.render('new');
});
app.post("/blogs", function(req, res) {
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/blogs");
        }
    });
});

//UPDATE
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

app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//SHOW ALL
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

//SHOW ONE
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

//DELETE
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

//create,       update,       show all     show one,      delete
//get, post     get, put      get          get            delete

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology : true});

const postSchema = new mongoose.Schema({
    title: String,
    content : String
});
const Post = mongoose.model("Post", postSchema);
const lodash = require("lodash");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
const content = "Lorem Ipsum is simply dummy text of the printing and typesetting industry" 
                + " Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
                + "when an unknown printer took a galley of type and scrambled it to make a type specimen book "
                + "It has survived not only five centuries, but also the leap into electronic typesetting, "
                + "remaining essentially unchanged. It was popularised in the 1960s with "
                + "the release of Letraset sheets containing Lorem Ipsum passages, and more"
                + "recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

const about = "It is a long established fact that a reader will be \
                    distracted by the readable content of a page when looking at its layout. \
                    The point of using Lorem Ipsum is that it has a more-or-less normal \
                    distribution of letters, as opposed to using 'Content here, content here', \
                    making it look like readable English. Many desktop publishing packages \
                    and web page editors now use Lorem Ipsum as their default model text, and a \
                    search for 'lorem ipsum' will uncover many web sites still in their infancy. \
                     Various versions have evolved over the years, sometimes by accident.";
                
app.get("/", function(request, response)
{
    Post.find({}, function(err, posts){
        response.render("home", {bodyContent : content, blogContent : posts});

    });
    
});


app.get("/about", function(request, response)
{
    response.render("about", {aboutContent: about});
});

app.get("/contact", function(request, response)
{
    response.render("contact", {contactContent: about});
});

app.get("/compose", function(request, response)
{
    response.render("compose");
});



app.post("/", function(request, response) 
{
    var titleC  = request.body.title;
    var message = request.body.message;
    const post = new Post({
        title: titleC,
        content: message 
    });
    post.save(function(err){
        if(!err)
        {
            response.redirect("/");
        }
        else
        {
            console.log(err);
        }
    });
});

app.get("/posts/:postId", function(request, response) 
{
    const postID = request.params.postId;
    Post.findOne({_id : postID}, function(error, post)
    {
        if(!error)
        {
            let postTitle = post.title;
            let postMess = post.content;
            response.render("post", {postTitle : postTitle, postMessage: postMess, title : postTitle});
        }
        else
        {
            response.render("post", {postTitle : "Entry not found!", postMessage: "The post does not exist. Please try again."});
        }
    });
});

app.listen(3000, function()
{
    console.log("Server running on port 3000");
});
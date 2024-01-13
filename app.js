//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Unlock the power of introspection with Daily Journal - Your Gateway to Personal Growth. Welcome to a space where your thoughts find a home, and your daily reflections turn into a meaningful journey. Embrace the art of storytelling, express your creativity, and capture the essence of each day. Our intuitive platform makes journaling a seamless and enriching experience. Join a community of like-minded individuals on a shared mission of self-discovery. Start your day, pen in hand, and let Daily Journal be your companion in the adventure of capturing life's moments, one entry at a time.";
const aboutContent = "Welcome to Daily Journal, your personal haven for expression and reflection. Dive into a world of introspection, creativity, and daily musings as you embark on your journey with us. Daily Journal is more than just a platform; it's a sanctuary for your thoughts, a canvas for your stories, and a space to embrace the art of self-discovery. Join our community of wordsmiths and seekers, where each day unfolds a new chapter in the narrative of your life. Start your daily journaling adventure with us today!";
const contactContent = "We're here to connect and hear your thoughts. Have a question, suggestion, or just want to say hello? Reach out to us! Our team at Daily Journal values your feedback and is dedicated to ensuring your experience is seamless. Feel free to drop us a message using the contact form below, and we'll get back to you as soon as possible. Thank you for being a part of our journey at Daily Journal, where every connection is a new chapter in our shared story.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", async function (req, res) {
  try {
    const posts = await Post.find({});
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  } catch (err) {
    console.log(err);
  }
});


app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save();

  res.redirect("/");

});

app.get("/posts/:postId", async function (req, res) {
  const requestedPostId = await req.params.postId;
  Post.findOne({ _id: requestedPostId })
    .then((post) => {
      if (post) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      }
    });


});



app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

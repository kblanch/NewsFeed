//Require Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
//Scraping Tools
var request = require("request");
var cheerio = require("cheerio");

var Article = require("./models/Article.js");

mongoose.Promise = Promise;
//Require Models

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

//Public is a static directory
app.use(express.static("public"));

mongoose.connect("mongodb://heroku_zz9r5vfc:amifl05tliq5ccibiae41ajlkv@ds139984.mlab.com:39984/heroku_zz9r5vfc", {
  useMongoClient: true,
});
//mongoose.connect("mongodb://localhost/newsfeedtest");
var db = mongoose.connection;

db.on("error", function(error){
    console.log("Mongoose Error: ", error);
});

db.once("open", function(){
    console.log("Mongoose is connected!");
});

app.get("/scrape", function(req,res){
    console.log("SCRAPE TIME");
    request("https://arstechnica.com/science/", function(error, response, html){
        var $ = cheerio.load(html);

        $("article header").each(function(i,element){
            var result = {};

            result.title = $(this).children("h2").children("a").text();
            result.link = $(this).children("h2").children("a").attr("href");
            result.summary = $(this).children("p.excerpt").text();

            //console.log($(this).children("p excerpt").text());

            var entry = new Article(result);

            entry.save(function(error,doc){
                if(error){
                    console.log(error);
                }
                else {
                    console.log(doc);
                }
            });
        });
    });
    res.send("Article Scraped");
});

app.get("/articles", function(request, response){
    Article.find({},function(error,document) {
        if(error){
            console.log(error);
        } else {
            response.json(document);
        }
    });
});

app.listen(3000,function(){
    console.log("App running on port 3000!");
});
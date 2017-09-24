//Require Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
//Scraping Tools
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;
//Require Models

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

//Public is a static directory
app.use(express.static("public"));


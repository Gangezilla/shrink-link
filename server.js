var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var wordList = require('word-list-json');
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI;

var app = express();
var prepareLink = require('./prepareLink');
var database=require('./database');

var urlOutput;
var urlInput;
var datab;

var port = process.env.PORT || 8080;
app.listen(port);
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({
    extended: true
}));
prepareLink.parseColors();

MongoClient.connect(url, function(err, db) {
	datab=db;
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the Mongo server.');
    }
});

app.use(bodyParser.json());
app.post("/", function(req, res) {
    urlInput=req.body.url;
    prepareLink.prepareLink(urlInput, datab);
    //do something with url.
});

//need to initialise database as well. not sure if that should be here, or elsewhere. we can dig, all good.
//module to get a user's input that gets submitted. won't be too hard, maybe should just do first???
//module to pick random words, then write to db, then fed back to user.
//module to check db for link, act accordingly.
//will need a HTML page to show the new URL. shouldn't need a 'new' page, jsut the old one with DOM manipulation.

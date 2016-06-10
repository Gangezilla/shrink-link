var express = require('express');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var fs = require('fs');
var bodyParser = require('body-parser');
var wordList = require('word-list-json');

var app = express();
var submit = require('./submit');

var port = process.env.PORT || 8080;
app.listen(port);
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({
    extended: true
}));
submit.parseColors();

app.use(bodyParser.json());
app.post("/", function(req, res) {
    //console.log(req.body.url);
    //submit.test(req.body.url);
    submit.prepareLink();
    //do something with url.
});


// //Here we are configuring express to use body-parser as middle-ware.
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

//inport node modules in here.

//need to initialise database as well. not sure if that should be here, or elsewhere. we can dig, all good.
//module to get a user's input that gets submitted. won't be too hard, maybe should just do first???
//module to pick random words, then write to db, then fed back to user.
//module to check db for link, act accordingly. 
//will need a HTML page to show the new URL. shouldn't need a 'new' page, jsut the old one with DOM manipulation.

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
var database = require('./database');

var urlOutput;
var urlInput;
var datab;
var clientReceive;

MongoClient.connect(url, function(err, db) {
    datab = db;
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the Mongo server.');
    }
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates');

var port = process.env.PORT || 8080;
app.listen(port);
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({
    extended: true
}));

prepareLink.parseColors();

app.use(bodyParser.json());
app.post("/", function(req, res) {
    urlInput = req.body.url;
    prepareLink.prepareLink(urlInput, datab, function(data) {
        console.log(data.ops);
        res.render('redirect', { data: data.ops});
    });
});

app.get("/", function(req, res) {
    res.render('index');
});

app.get('/:urlOutput', function(req, res) {
    var doc = {
        urlInput: '',
        urlOutput: req.params.urlOutput
    };
    database.mongoGetLink(datab, 'urls', doc, function(err, data) {
        if (err) {
            console.log(err);
            return data(err);
        } else {
            if (data.length === 0) {
                res.render('redirectFail.ejs');
            } else {
                console.log(data);
                res.redirect(data[0].urlInput);
                //return res.json(data);
            }
        }
    });
});

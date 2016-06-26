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
app.listen(port, function() {
    console.log('listening on ' + port);
});
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({
    extended: true
}));

prepareLink.parseColors();

app.use(bodyParser.json());
app.post("/", function(req, res) {
    urlInput = req.body.url;
    prepareLink.prepareLink(urlInput, datab, function(data) {
        if (data.ops !== undefined) {
            res.render('redirect', { urlInput: data.ops[0].urlInput.replace('"', ""), urlOutput: data.ops[0].urlOutput.replace('"', "") });
        } else {
            res.render('redirect', { urlInput: data[0].urlInput.replace('"', ""), urlOutput: data[0].urlOutput.replace('"', "") });
        }
    });
});

app.get("/", function(req, res) {
    res.render('index');
});

function addhttp(res, url) {
    if (!/^(f|ht)tps?:\/\//i.test(url)) {
        url = "http://" + url;
    }
    res.redirect(url);
    return url;
}

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
                addhttp(res, data[0].urlInput);
            }
        }
    });
});

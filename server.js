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

app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates');

var port = process.env.PORT || 8080;
app.listen(port);
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({
    extended: true
}));

prepareLink.parseColors();

MongoClient.connect(url, function(err, db) {
    datab = db;
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the Mongo server.');
    }
});

app.use(bodyParser.json());
app.post("/", function(req, res) {
    urlInput = req.body.url;
    prepareLink.prepareLink(urlInput, datab);
    //do something with url.
});

app.get("/", function(req, res) {
    res.render('index', { data: clientReceive });
});

// app.post("/get_users_list", function(req, res) {
//         var body = req.body;
//         db.getUsersByCity(body.city, function(err, data){
//             if (err) {
//                 console.log(err);
//                 return res(err);
//             } else {
//                 console.log(data);
//                 return res.json(data);
//             }
//         });
//     });

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
                //do nothing.
                console.log('link not found.');
                res.redirect('/');
            } else {
                console.log(data);
                res.redirect(data[0].urlInput);
                //return res.json(data);
            }
        }
    });
});
// db.close();
//                console.log('redirecting...');
//                x=res[0].urlInput;
//                res.redirect(res);


//will need a HTML page to show the new URL. shouldn't need a 'new' page, jsut the old one with DOM manipulation.

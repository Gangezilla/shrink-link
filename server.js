var express=require('express');
var app=express();
var path=require('path');
var mongo=require('mongodb').MongoClient;

var port=process.env.PORT || 8080;
app.listen(port);
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', function (req, res) {
	//so, this will serve up a HTML page that invites a user to type in the url they want to shorten.
});

app.get('/:shortened', function(req, res) {
	input=req.params.shortened;
	//this will take the users input (which is a short link), and then poll the database to see if we have the link, if we don't it'll return an error. if we do, then it'll redirect the user to the link that's stored at that point in the database.
});

//inport node modules in here.

//need to initialise database as well. not sure if that should be here, or elsewhere. we can dig, all good.
var mongodb = require('mongodb');
var prepareLink = require('./prepareLink');
var serv=require('./server.js');

var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI;

var doc = {
    urlInput: '',
    urlOutput: ''
};

var output='test';

module.exports = {
    output: function() {
        console.log(output);
        return output;
    },

    mongoInsert: function(db, collection_name, data, cb) {
        var collection = db.collection(collection_name);
        collection.insert(data, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log('Inserted into the ' + collection_name + ' collection');
                cb(res);
                output = res;
            }
        });
    },

    mongoCheckInput: function(db, collection_name, data, cb) {
        var collection = db.collection(collection_name);
        collection.find({ urlInput: data.urlInput }).toArray(function(err, res) {
            if (res.length === 0) {
                console.log('URL has not been used before');
                module.exports.mongoCheckOutput(db, collection_name, data, cb);
            } else {
                console.log('URL is not new, display previous entry');
                cb(res);
            }
        });
    },

    mongoCheckOutput: function(db, collection_name, data, cb) {
        var collection = db.collection(collection_name);
        collection.find({ urlOutput: data.urlOutput }).toArray(function(err, res) {
            if (res.length === 0) {
                console.log('Generated URL is fresh');
                //write doc to db.
                module.exports.mongoInsert(db, collection_name, data, cb);
            } else {
                console.log('Generated URL is stale, make a new one');
                prepareLink.prepareLink(data.urlInput, db);
            }
        });
    },
    //next time, there's a lot (LOT) of scope to improve this. one find function with a spot to put the thing you want to find, as well as the callback. you've sort of weirdly hard coded it in here and that's not so good. oh well, learning.
    mongoGetLink: function(db, collection_name, data, cb) {
        console.log('Searching for link...');
        var collection = db.collection(collection_name);
        collection.find({ urlOutput: data.urlOutput }).toArray(cb);
    },

    pass: function(doc, db, cb) {
        module.exports.mongoCheckInput(db, 'urls', doc, function(user_res) {
            //console.log(user_res);
            output = user_res;
            db.close();
            cb(output);
            return output;
        });

    },
};

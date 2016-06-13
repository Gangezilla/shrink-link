var mongodb = require('mongodb');
var prepareLink = require('./prepareLink');

var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI;

var doc = {
    urlInput: '',
    urlOutput: ''
};

module.exports = {

     mongoInsert:function(db, collection_name, data, cb) {
        var collection = db.collection(collection_name);
        collection.insert(data, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log('Inserted into the ' + collection_name + ' collection');
                cb(res);
            }
        });
      },

      mongoCheckInput:function(db, collection_name, data, cb) {
        var collection=db.collection(collection_name);
        collection.find({urlInput:data.urlInput}).toArray(function (err, res) {
          if (res.length===0) {
            console.log('URL has not been used before');
            module.exports.mongoCheckOutput(db, collection_name, data, cb);
          }
          else {
            console.log('URL is not new, display previous entry');
            //at this point, display the URL to someone.
            cb(res);
          }
        });
      },

      mongoCheckOutput:function(db, collection_name, data, cb) {
        var collection=db.collection(collection_name);
        collection.find({urlOutput:data.urlOutput}).toArray(function (err, res) {
          if (res.length===0) {
            console.log('Generated URL is fresh');
            //write doc to db.
            module.exports.mongoInsert(db, collection_name, data, cb);
          }
          else {
            console.log('Generated URL is stale, make a new one');
            prepareLink.prepareLink(data.urlInput, db);
          }
       });
      },

      mongoGetLink:function(db, collection_name, data, cb) {
        console.log('Searching for link...');
          var collection=db.collection(collection_name);
          collection.find({urlOutput:data.urlOutput}).toArray(cb); //{
            // console.log('we have a response');
            // if (res.length===0) {
            //   console.log('hasnt been used before.');
            //   return false;
            // } else {
            //   console.log('found it!');
            //   console.log(res[0].urlInput);
            // }
         // });
       },

      pass:function(doc, db){
        module.exports.mongoCheckInput(db, 'urls', doc, function(user_res) {
          console.log(user_res);
          db.close();
        });

      },

};
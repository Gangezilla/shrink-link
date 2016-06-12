var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI;

var doc = {
    urlInput: '',
    urlOutput: ''
};
// module.exports.mongoInsert(db, 'urls', doc, function(user_res) {
//             console.log(user_res);
//             db.close();
//         });


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

      //, {urlOutput:1}
      mongoCheckInput:function(db, collection_name, data, cb) {
        var collection=db.collection(collection_name);
        collection.find({urlInput:data.urlInput}).toArray(function (err, result) {
          console.log(result);
            cb(result);
        });
        // collection.find({urlOutput:data.urlOutput},
        //   function (err, data) {
        //     if (err) throw err;
        //     else {
        //       cb(data);
        //     }
        //   });
        //
        // db.collection.findOne({
        //   urlOutput:data.urlOutput
        // }, function (err, doc) {
        //   if (err||!doc) cb(null);
        //   else cb(doc.text);
        // });

      },

      pass:function(doc, db, urlInput){
        //check if linkInput, and linkOutput exist in the database already.
        //
        // module.exports.mongoInsert(db, 'urls', doc, function(user_res){
        //   console.log(user_res);
        //   db.close();
        // });
        module.exports.mongoCheckInput(db, 'urls', doc, function(user_res) {
          //console.log(user_res);
          db.close();
        });

      },

};

    // writeToDB: function(urlInput, urlOutput) {
    //     MongoClient.connect(url, function(err, db) {
    //         if (err) {
    //             console.log('Unable to connect to the mongoDB server. Error:', err);
    //         } else {
    //             console.log('Connection established to', url);
    //             doc = {
    //                 urlInput: urlInput,
    //                 urlOutput: urlOutput
    //             };
    //             console.log(doc);
    //             var collection = db.collection('urls');
    //             collection.insert(doc, function(err, data) {
    //                 if (err) throw (err);
    //                 console.log(JSON.stringify(doc));
    //             });
    //             // do some work here with the database.

    //             //Close connection
    //             db.close();
    //         }
    //     });
    // },
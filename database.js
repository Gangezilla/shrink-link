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

      pass:function(doc, db){
        //how to pass db in here to write in...???
        module.exports.mongoInsert(db, 'urls', doc, function(user_res){
          console.log(user_res);
          db.close();
        });

      }
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
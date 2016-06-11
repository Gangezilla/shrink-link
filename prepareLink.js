var fs = require('fs');
var wordList = require('word-list-json');
var database=require('./database');

var stuff = {
    color: "",
    word: ""
};
var colors = [];

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getColors() {
    var color;
    var seed = randomNum(0, colors.length);
    stuff.color = colors[seed].split(" ").join("-").toLowerCase();
    return stuff.color;
}

function getWord() {
    //75322 is not some random number, it's the end of the 6 letter words. i think if words were much longer, it would be a bit crazy...
    var word;
    var seed = randomNum(0, 75322);
    stuff.word = wordList[seed];
    return stuff.word;
}

module.exports = {
    parseColors: function() {
        fs.readFile("assets/colors.json", 'utf8', function(err, data) {
            if (err) throw err;
            obj = JSON.parse(data);
            for (var i = 0; i < obj.length; i++) {
                colors.push(obj[i].name);
            }
        });
    },

    prepareLink: function(urlInput, db) {
        getColors();
        getWord();
        urlOutput = stuff.color + "-" + stuff.word;
        doc = {
        	urlInput: urlInput,
        	urlOutput: urlOutput
        };
        database.pass(doc, db);
    },
};

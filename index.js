"use strict";

var fs = require("fs");
var htmlparser = require("htmlparser2");
var stringFinder = require("./stringFinder");

var html = fs.readFileSync(process.argv.pop());

var parser = new htmlparser.Parser(stringFinder, {decodeEntities: true});
parser.write(html);
parser.end();

//console.log(stringFinder.keys);
var htmlText = html.toString();
stringFinder.rxs.forEach(function(regex, i) {
    var rx = new RegExp(regex);
    if(!rx.test(html)) {
        console.log(regex, 'not found');
    } else {
        //console.log(html.toString());
        htmlText = htmlText.replace(rx, '${' + i + '}');
    }
});
console.log(htmlText);
console.error(stringFinder.keys);

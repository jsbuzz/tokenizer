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
var i = 0;
Object.keys(stringFinder.rxs).forEach(function(key) {
    var rx = new RegExp(stringFinder.rxs[key], 'g');
    if(!rx.test(html)) {
        console.log(regex, 'not found');
    } else {
        htmlText = htmlText.replace(rx, '${' + i + '}');
    }
    // bump key index for test
    i ++;
});
console.log(htmlText);
console.error(Object.keys(stringFinder.rxs));

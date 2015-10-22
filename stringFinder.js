var stringFinder = {
    path: [],
    textDepth : 0,
    currentKey : '',
    currentRx : '',
    keys: [],
    rxs: [],
    inlineTags : {'b' : 1, 'strong' : 1, 'i' : 1, 'u' : 1, 'span' : 1},
    ignoredTags: {'script' : 1, 'style' : 1}
};

stringFinder.createInlineTag = function(tag, attributes) {
    var attrString = "";
    Object.keys(attributes).forEach( key => {
        attrString += " " + key + (attributes[key] ? '="' + attributes[key] + '"' : '');
    });
    return '<' + tag + attrString + '>';
};

stringFinder.onopentag = function(tagName, attributes) {
    this.path.push(tagName);
    if(this.textDepth || this.inlineTags[tagName]) {
        this.currentKey += this.createInlineTag(tagName, attributes);
        this.currentRx += '\\s*<[^>]*>\\s*'
        if(!this.textDepth) {
            this.textDepth = this.path.length - 1;
        }
    }
};

stringFinder.ontext = function(text) {
    if(!text.trim() || this.ignoredTags[this.path[this.path.length-1]]) {
        return;
    }
    if(!this.textDepth) {
        this.textDepth = this.path.length;
        this.currentKey = '';
        this.currentRx = '';
    }
    this.currentKey += text.replace(/\s\s+/g, " ");;
    this.currentRx += text.replace(/\s\s+/g, "\\s+");;
};

stringFinder.onclosetag = function(tagName) {
    this.path.pop();
    if(this.path.length >= this.textDepth) {
        this.currentKey += '</' + tagName + '>';
        this.currentRx += '\\s*<[^>]*>\\s*';
    } else if(this.path.length == this.textDepth-1) {
        //console.log('saving', this.currentRx.trim());
        this.keys.push(this.currentKey.trim());
        this.rxs.push(this.currentRx.trim());
        this.currentKey = '';
        this.currentRx = '';
        this.textDepth = 0;
    }
};

module.exports = stringFinder;

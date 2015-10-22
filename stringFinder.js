var stringFinder = {
    path: [],
    textDepth : 0,
    currentKey : '',
    currentRx : '',
    strings: [],
    rxs: {},
    inlineTags : {'b' : 1, 'strong' : 1, 'i' : 1, 'u' : 1, 'span' : 1},
    ignoredTags: {'script' : 1, 'style' : 1},
    tagRX: '\\s*<[^>]*>\\s*'
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
        this.currentRx += this.tagRX;
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
        this.currentRx += this.tagRX;
    } else if(this.path.length == this.textDepth-1) {
        var key = this.currentKey.trim();
        this.strings.push(key);
        this.rxs[key] = this.currentRx.trim();
        this.currentKey = '';
        this.currentRx = '';
        this.textDepth = 0;
    }
};

module.exports = stringFinder;

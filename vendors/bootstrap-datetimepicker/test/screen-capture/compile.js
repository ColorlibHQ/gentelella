var fs = require("fs");

var base = fs.readFileSync('base.html').toString();

['top','bottom'].forEach(function(v){
    ['left','right'].forEach(function(h){
        ['1','2','3','4','5'].forEach(function(t){
            var text = fs.readFileSync('t' +t+'.html').toString();
            var outFile = 'out/' + t +v.charAt(0) + h.charAt(0) + '.html';
            var out = base
                .replace(/\{\{\{t\}\}\}/g,text)
                .replace(/\{\{v\}\}/g,v)
                .replace(/\{\{h\}\}/g,h);
            fs.writeFileSync(outFile, out);
        });
    });
});

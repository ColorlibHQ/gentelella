var fs = require('fs');
['top','bottom'].forEach(function(v){
    ['left','right'].forEach(function(h){
        ['1','2','3','4','5'].forEach(function(t){
            var inFile = 'out/'+ t +v.charAt(0) + h.charAt(0) + '.html';
            var outFile = 'pic/'+ t + v.charAt(0) + h.charAt(0) + '.png';
            var path = 'file://' + fs.absolute(inFile)
            var page = require('webpage').create();
            page.viewportSize = {
                width: 1000,
                height: 800
            };;
            page.open(path, function(status) {
                window.setTimeout(function () {
                console.log(status);
                page.render(outFile);
                setTimeout(function(){
                    phantom.exit();
                }, 0);
                },2000);
            });
        });
    });
});
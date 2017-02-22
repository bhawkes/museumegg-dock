const ProcessCsv = require('./lib/ProcessCsv.js');
const chokidar = require('chokidar');
const watcher = chokidar.watch('~/public/*.csv', {
  persistent: true
});

// When files are added to the ~/public/ folder of type CSV....
watcher.on('add', function(path) {
    //...We're processing....
    console.log(`File ${path} added...processing`);
    ProcessCsv.load(path)
        .then(function(data) {
            // Log stuff
            console.log(ProcessCsv.top(3));
            console.log(`${path} processed`);
        }).catch(function (err) {
            console.error(err);
        });

})

const ProcessCsv = require('./lib/ProcessCsv.js');
// Go go go
ProcessCsv.load('./1487701680548.csv')
    .then(function(data) {
        console.log(data);
    }).catch(function (err) {
        console.error(err);
    });

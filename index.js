const ProcessCsv = require('./lib/ProcessCsv.js');


ProcessCsv.load('./1487702986724.csv')
    .then(function(data) {
        console.log(ProcessCsv.top(3));

    }).catch(function (err) {
        console.error(err);
    });

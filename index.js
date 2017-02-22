const ProcessCsv = require('./lib/ProcessCsv.js');
const chokidar = require('chokidar');
const watcher = chokidar.watch('./tmp/*.csv', {
	persistent: true
});

// firebase
const admin = require("firebase-admin");

admin.initializeApp({
	credential: admin.credential.cert("creds.json"),
	databaseURL: "https://smhack-159507.firebaseio.com"
});

var auth = admin.auth();

var db = admin.database();

var fbData = db.ref();


// When files are added to the ~/public/ folder of type CSV....
watcher.on('add', function(path) {
	//...We're processing....
	console.log(`File ${path} added...processing`);
	ProcessCsv.load(path)
		.then(function(data) {
			// Log stuff

			console.log(data);

			fbData.push(ProcessCsv.top(3));

			console.log(`${path} processed`);
		}).catch(function(err) {
			console.error(err);
		});

})

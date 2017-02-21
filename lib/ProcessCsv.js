const csv = require('csv-streamify');
const fs = require('fs');

module.exports = (function () {
    'use strict';

    // Control the different boundaries - lowest being 6 metres(?)
    const LOW_BOUNDARY = 6;
    const MID_BOUNDARY = 4;
    const HIGH_BOUNDARY = 1;

    var headers = false;
    var filename = '';
    var data = {};

    /**
     * Generate the distance based on the power and rssi
     *
     * @param int   power   The power output of the beacon
     * @param int   rssi    The RSSI output of the device
     *
     * @return float
    **/
    function generateDistance(power, rssi) {
        if (rssi === 0) {
            return -1.0;
        }
        let ratio = (rssi*1.0) / power;
        if (ratio < 1.0) {
            return Math.pow(ratio, 10);
        }
        return (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
    }

    /**
     * Get the score from the boundaries based on the distance
     *
     * @param float     distance    The distance
     *
     * @return int
    **/
    function getScore(distance) {
        if (distance > MID_BOUNDARY) {
            return LOW_BOUNDARY;
        }
        if (distance < MID_BOUNDARY && distance > HIGH_BOUNDARY) {
            return MID_BOUNDARY;
        }
        if (distance <= HIGH_BOUNDARY) {
            return HIGH_BOUNDARY;
        }
    }
    return {
        /**
         * Exposed load function, takes in the filename and creates the output object
         *
         * @param string    filename    The filename and file path
         *
         * @return Promise
        **/
        load : function(filename) {
            // create our CSV parser
            const parser = csv({objectMode: true});
            // pipe our file to the parser
            fs.createReadStream(filename).pipe(parser);
            return new Promise(function(resolve, reject) {
                // reading data from the parser
                parser.on('data', function(line) {
                    if (!headers) {
                        headers = line;
                        return;
                    }
                    // Generate a row from the headers and the current line
                    let row = {}
                    headers.forEach((val, i) => row[val] = line[i]);
                    // Calculate the distance and score
                    row.distance = generateDistance(row.power, row.rssi);
                    if (row.distance < LOW_BOUNDARY) {
                        if (!data.hasOwnProperty(row.hash)) {
                            data[row.hash] = {
                                time: 0,
                                score: 0
                            }
                        }
                        data[row.hash].time++;
                        data[row.hash].score += getScore(row.distance);
                    }
                });
                // Either resolve the data, or reject with error
                parser.on('end', function() {
                    resolve(data)
                })
                parser.on('err', function(err) {
                    reject(err);
                })
            });
        }
    }

})();

/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017 Loreto Parisi
*/

"use strict";

(function() {

var DATA_ROOT=__dirname+'/data';

var TESTFILE = process.env.TESTFILE || DATA_ROOT + '/band_test.txt' // test file
var MODEL= process.env.MODEL || DATA_ROOT + '/band_model.bin' // model to load

var FastText = require('../lib/index');

var fastText = new FastText({
    debug: true,
    loadModel: MODEL,
    testFile: TESTFILE
});

fastText.test()
.then(evaluation=> {
    console.log("test done.",evaluation);
})
.catch(error => {
    console.error("test error",error);
})

}).call(this);
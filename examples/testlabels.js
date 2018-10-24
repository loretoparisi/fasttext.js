/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017 Loreto Parisi
*/

"use strict";

(function() {

var DATA_ROOT=__dirname+'/data';

var TESTFILE = process.env.TESTFILE || DATA_ROOT + '/sms_test.tsv' // test file
var MODEL= process.env.MODEL || DATA_ROOT + '/sms_model.bin' // model to load

var FastText = require('../lib');

var fastText = new FastText({
    debug: true,
    // true to preprocess dataset with custom labels
    // false to use default label prefix (__label__)
    // this must be coherent with training setup
    preprocess: true,
    loadModel: MODEL,
    testFile: TESTFILE
});
fastText.testLabels()
.then(evaluation=> {
    console.log("labels:", fastText.getLabels());
    console.log("test-labels:",JSON.stringift(evaluation,null,2));
})
.catch(error => {
    console.error("test error",error);
})

}).call(this);
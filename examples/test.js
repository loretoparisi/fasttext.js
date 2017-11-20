/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017 Loreto Parisi
*/

"use strict";

(function() {

var DATA_ROOT='./data';
var FastText = require('../lib/index');

var fastText = new FastText({
    debug: true,
    loadModel: DATA_ROOT + '/band_model.bin',
    testFile: DATA_ROOT + '/band_test.txt'
});

fastText.test()
.then(evaluation=> {
    console.log("test done.",evaluation);
})
.catch(error => {
    console.error("test error",error);
})

}).call(this);
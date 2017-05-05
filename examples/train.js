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
    serializeTo: DATA_ROOT + '/band_model', // do not specify ext: 'bin' will be added
    trainFile: DATA_ROOT + '/band_train.txt'
});

fastText.train()
.then(done=> {
    console.log("train done.");
})
.catch(error => {
    console.error("train error",error);
})

}).call(this);
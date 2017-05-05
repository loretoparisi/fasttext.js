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
    loadModel: DATA_ROOT + '/band_model.bin', // must specifiy filename and ext
    serializeTo: DATA_ROOT + '/band_model' // do not specify ext: 'ftz' will be added
});

fastText.quantize()
.then(done=> {
    console.log("quantize done.");
})
.catch(error => {
    console.error("quantize error",error);
})

}).call(this);
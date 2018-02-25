/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017-2018 Loreto Parisi
*/

"use strict";

(function() {

var DATA_ROOT=__dirname+'/data';

var FastText = require('../lib/index');
var fastText = new FastText({
    loadModel: DATA_ROOT + '/sms_model_w2v.bin' // must specifiy filename and ext
});
var text="nokia";
    
// load unsupervised model
fastText.loadnn()
.then(labels=> {
    // find Nearest Neighbor words
    return fastText.nn(text)
})
.then(labels=> {
    console.log("Nearest Neighbor\n", JSON.stringify(labels, null, 2));
    fastText.unload();
})
.then(done => {
    console.log("model unloaded.");
})
.catch(error => {
    console.error("predict error",error);
});

}).call(this);
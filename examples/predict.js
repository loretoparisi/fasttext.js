/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017 Loreto Parisi
*/

"use strict";

(function() {

var DATA_ROOT=__dirname+'/data';

var FastText = require('../lib/index');
var fastText = new FastText({
    loadModel: DATA_ROOT + '/sms_model.bin' // must specifiy filename and ext
});

var sample="You have won a phone! Please apply now!";
fastText.load()
.then(done => {
    return fastText.predict(sample);
})
.then(labels=> {
    console.log("TEXT:", sample, "\nPREDICT:",labels );
    sample="Hi John this is Scott, please call me back";
    return fastText.predict(sample);
})
.then(labels=> {
    console.log("TEXT:", sample, "\nPREDICT:",labels );
    fastText.unload();
})
.then(done => {
    console.log("model unloaded.");
})
.catch(error => {
    console.error("predict error",error);
});

}).call(this);
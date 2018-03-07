/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017-2018 Loreto Parisi
*/

"use strict";

(function() {

var DATA_ROOT=__dirname+'/data';

var Util = require('../lib/util');
var FastText = require('../lib/index');
var fastText = new FastText({
    predict: {
        mostlikely: 10,
        normalize: true
    },
    loadModel: DATA_ROOT + '/sms_model_w2v.bin' // must specifiy filename and ext
});

function getRandomWord(arr) {
    var word='';
    while( word.length <= 3) {
        word=Util.randomElement( Util.randomElement(arr).split(/[\s.]/) );
    }
    return word;
}

var samples=[
    "You have WON a guaranteed �1000 cash or a �2000 prize. To claim yr prize call our customer service representative on 08714712379 between 10am-7pm Cost 10p",
    "Sounds better than my evening im just doing my costume. Im not sure what time i finish tomorrow but i will txt you at the end"
];

    
// load unsupervised model
fastText.loadnn()
.then(labels=> {
    // find Nearest Neighbor words
    var word=getRandomWord(samples);
    console.log("find Nearest Neighbor of \"%s\"",word);
    return fastText.nn(word)
})
.then(labels=> {
    console.log(JSON.stringify(labels, null, 2));
    var word=getRandomWord(samples);
    console.log("find Nearest Neighbor of \"%s\"",word);
    return fastText.nn(word);
})
.then(labels=> {
    console.log(JSON.stringify(labels, null, 2));
    fastText.unload();
})
.then(done => {
    console.log("model unloaded.");
})
.catch(error => {
    console.error("predict error",error);
});

}).call(this);
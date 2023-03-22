/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017-2019 Loreto Parisi
*/

"use strict";

(function () {

    var MODELS_ROOT = __dirname + '/models';

    var FastText = require('../lib/index');
    var ft = new FastText({
        loadModel: MODELS_ROOT + '/sms_model.bin' // must specifiy filename and ext
    });

    var sample = "You have won a phone! Please apply now!";
    ft.loadSentence(sample)
        .then(done => {
            return ft.sentence(sample);
        })
        .then(vector => {
            console.log("TEXT:", sample, "\nPREDICT:", vector);
            sample = "Hi John this is Scott, please call me back";
            return ft.sentence(sample);
        })
        .then(vector => {
            console.log("TEXT:", sample, "\nPREDICT:", vector);
            ft.unload();
        })
        .then(done => {
            console.log("model unloaded.");
        })
        .catch(error => {
            console.error("predict error", error);
        });

}).call(this);
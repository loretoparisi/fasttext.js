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
    ft.load()
        .then(done => {
            return ft.predict(sample);
        })
        .then(labels => {
            console.log("TEXT:", sample, "\nPREDICT:", labels);
            sample = "Hi John this is Scott, please call me back";
            return ft.predict(sample);
        })
        .then(labels => {
            console.log("TEXT:", sample, "\nPREDICT:", labels);
            ft.unload();
        })
        .then(done => {
            console.log("model unloaded.");
        })
        .catch(error => {
            console.error("predict error", error);
        });

}).call(this);
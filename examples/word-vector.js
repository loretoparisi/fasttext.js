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

    var word = "phone";
    ft.loadWord()
        .then(done => {
            return ft.word(word);
        })
        .then(vector => {
            console.log("TEXT:", word, "\nPREDICT:", vector);
            word = "call";
            return ft.word(word);
        })
        .then(vector => {
            console.log("TEXT:", word, "\nPREDICT:", vector);
            ft.unload();
        })
        .then(done => {
            console.log("model unloaded.");
        })
        .catch(error => {
            console.error("predict error", error);
        });

}).call(this);
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
        predict: {
            // k most likely labels for each line <= labels count
            mostlikely: 2,
            verbosity: 2,
            // true to normalize input text before prediction
            normalize: false
        },
        loadModel: MODELS_ROOT + '/lid.176.ftz' // must specifiy filename and ext
    });
    let text = "Bonjour à tous. Ceci est du français";
    ft.loadWASM()
        .then(_ => {
            return ft.predictWASM(text);
        })
        .then(labels => {
            console.log("TEXT:", text, "\nPREDICT:", labels);
        })
        .catch(error => {
            console.error("predict error", error);
        });

}).call(this);
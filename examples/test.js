/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017-2019 Loreto Parisi
*/

"use strict";

(function () {

    var DATASET_ROOT = __dirname + '/dataset';
    var MODELS_ROOT = __dirname + '/models';

    var TESTFILE = process.env.TESTFILE || DATASET_ROOT + '/sms_dataset_test.tsv' // test file
    var MODEL = process.env.MODEL || MODELS_ROOT + '/sms_model.bin' // model to load

    var FastText = require('../lib/index');

    var ft = new FastText({
        debug: true,
        loadModel: MODEL,
        testFile: TESTFILE
    });

    ft.test()
        .then(evaluation => {
            console.log("test done.", evaluation);
        })
        .catch(error => {
            console.error("test error", error);
        })

}).call(this);
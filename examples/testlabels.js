/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017-2019 Loreto Parisi
*/

"use strict";

(function () {

    var MODELS_ROOT = __dirname + '/models';
    var DATASET_ROOT = __dirname + '/dataset';

    var TESTFILE = process.env.TESTFILE || DATASET_ROOT + '/sms_dataset_test.tsv' // test file
    var MODEL = process.env.MODEL || MODELS_ROOT + '/sms_model.bin' // model to load

    var FastText = require('../lib');
    var ft = new FastText({
        debug: true,
        // true to preprocess dataset with custom labels
        // false to use default label prefix (__label__)
        // this must be coherent with training setup
        preprocess: true,
        loadModel: MODEL,
        testFile: TESTFILE
    });
    ft.testLabels()
        .then(evaluation => {
            console.log("labels:", ft.getLabels());
            console.log("test-labels:", JSON.stringify(evaluation, null, 2));
        })
        .catch(error => {
            console.error("test error", error);
        })

}).call(this);
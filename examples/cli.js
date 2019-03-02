/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017-2019 Loreto Parisi
*/

"use strict";

(function () {

    var readline = require('readline');

    /**
     * A simple Command Line Interface
     * using events
     */
    function startCLI()  {
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log("Welcome to FastText.js CLI\nType exit or CTRL-Z to exit");
        //rl.setPrompt('Say something> ');
        rl.prompt();
        rl.on('line', function (line) {
            line  = line.trim();
            switch (line) {
                case 'exit':
                    ft.unload()
                        .then(done => {
                            console.log("model unloaded.");
                            process.exit(0);
                        })
                        .catch(error => {
                            console.error("predict error", error);
                            process.exit(0);
                        });
                    break;
                default:
                    ft.predict(line)
                        .then(labels => {
                            console.log(labels);
                        })
                        .catch(error => {
                            console.error("predict error", error);
                        });
                    break;
            }
            rl.prompt();
        }).on('close', function () {
            console.log('model unloaded.');
            process.exit(0);
        });
    }

    var MODELS_ROOT = __dirname + '/models';

    var FastText = require('../lib/index');
    var ft = new FastText({
        loadModel: process.env.MODEL || (MODELS_ROOT + '/sms_model.bin') // must specifiy filename and ext
    });

    console.log("Loading model...");
    ft.load()
        .then(done => {
            console.log("model loaded.");
            startCLI();
        })
        .catch(error => {
            console.error("predict error", error);
        });


}).call(this);

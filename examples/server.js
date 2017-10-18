/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017 Loreto Parisi
*/

"use strict";

(function () {

    var queryString = require('querystring'),
        FastText = require('../lib/index');
    

    const port = 3000
    const http = require('http');
    const fastText = new FastText({
        loadModel: './data/band_model.bin' // must specifiy filename and ext
    });

    /**
     * simple request handler
     */
    const requestHandler = (request, response) => {

        var req_start = new Date().getTime();
        var query = request.url.split('?')[1];
        var queryObj = queryString.parse(query);

        console.log(queryObj);

        fastText.predict(queryObj.text)
            .then(labels => {
                var req_end= (new Date().getTime()-req_start)/1000;
                var res={
                    response_time: req_end,
                    predict: labels
                }
                console.log("response time:",req_end);
                response.end( JSON.stringify(res, null, 2) );
            })
            .catch(error => {
                console.error("predict error", error);
            });

    }//requestHandler

    const server = http.createServer(requestHandler);
    
    // defer http server listen to module loading
    fastText.load()
    .then(done => {
        console.log("model loaded");
        server.listen(port, (error) => {
            if (error) {
                console.error(error);
            }
            console.log(`server is listening on ${port}`)
        })

    })
    .catch(error => {
        console.error("load error", error);
    });


}).call(this);
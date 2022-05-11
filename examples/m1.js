/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017-2019 Loreto Parisi
*/

"use strict";

(function () {
    const os = require('os')
    let cpuCore = os.cpus()
    let isIntel = cpuCore[0].model.includes("Intel")
    let isM1 = cpuCore[0].model.includes("Apple")
    console.log(isIntel, isM1)

}).call(this);
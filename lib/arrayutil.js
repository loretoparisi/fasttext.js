/**
 * FastText.js
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017-2020 Loreto Parisi
*/

(function () {

    var ArrayUtil = {
        /**
         * 
         * @param {*} vecA 
         * @param {*} vecB 
         */
        dotProduct: function (vecA, vecB) {
            let product = 0;
            for (let i = 0; i < vecA.length; i++) {
                product += vecA[i] * vecB[i];
            }
            return product;
        },
        /**
         * 
         * @param {*} vec 
         */
        magnitude: function (vec) {
            let sum = 0;
            for (let i = 0; i < vec.length; i++) {
                sum += vec[i] * vec[i];
            }
            return Math.sqrt(sum);
        },
        /**
         * https://medium.com/analytics-vidhya/building-a-text-similarity-checker-using-cosine-similarity-in-javascript-and-html-75722d485703
         * @param {*} vecA 
         * @param {*} vecB 
         */
        cosineSimilarity: function (vecA, vecB) {
            return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
        }
    }
    module.exports = ArrayUtil;

}).call(this);
var {FastText,addOnPostRun}  = require('./fasttext');

const printVector = function(predictions, limit) {
    limit = limit || Infinity;

    for (let i=0; i<predictions.size() && i<limit; i++){
        let prediction = predictions.get(i);
        console.log(predictions.get(i));
    }
}

addOnPostRun(() => {
    let ft = new FastText();

    const url = "lid.176.ftz";
    ft.loadModel(url).then(model => {
        let text = "Bonjour à tous. Ceci est du français";
        console.log(text);
        printVector(model.predict(text, 5, 0.0));

        text = "Hello, world. This is english";
        console.log(text);
        printVector(model.predict(text, 5, 0.0));

        text = "Merhaba dünya. Bu da türkçe"
        console.log(text);
        printVector(model.predict(text, 5, 0.0));
    });
});
const {FastText,addOnPostRun}  = require('./fasttext');

const printVector = function(predictions, limit) {
    limit = limit || Infinity;

    for (let i=0; i<predictions.size() && i<limit; i++){
        let prediction = predictions.get(i);
        console.log(predictions.get(i));
    }
}

const trainCallback = (progress, loss, wst, lr, eta) => {
    console.log([progress, loss, wst, lr, eta]);
};

addOnPostRun(() => {
    let ft = new FastText();

    ft.trainUnsupervised("../examples/dataset/shakespeare.norm.txt", 'skipgram', {
        'lr':0.1,
        'epoch':1,
        'loss':'ns',
        'wordNgrams':2,
        'dim':50,
        'bucket':200000
    }, trainCallback).then(model => {
        let wordsInformation = model.getWords();
        printVector(wordsInformation[0], 30);   // words
        printVector(wordsInformation[1], 30);   // frequencies
        printVector( model.getNearestNeighbors("love",3) );
        printVector(model.getAnalogies("love", "woman", "hate", 3));
    });
});
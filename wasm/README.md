# WebAssembly support
Compiled wasm files

## How to run
```
node predict.js
```

## How to build

### Compile from FastText sources
If you want to compile the module again from source please use the provided `Makefile` and copy to fastText folder, then build `wasm` target:
```
git clone https://github.com/loretoparisi/fasttext.js.git
git clone https://github.com/facebookresearch/fastText.git
cp fasttext.js/wasm/Makefile fastText/
cd fastText
wasm clean
wasm make
cd webassembly/
cp *.wasm fasttext.js/wasm/
cp *.js fasttext.js/wasm/
```

### Changes for NodeJS
Apply the following changes to the copied javascript files

- `fasttext_wasm.js`
    `export default FastTextModule;` => `module.exports = FastTextModule;`
- `fasttest.js`
    `import fastTextModularized from './fasttext_wasm.js';` => `const fastTextModularized = require('./fasttext_wasm.js');`
    `export {FastText, addOnPostRun};` => `module.exports = {FastText, addOnPostRun};`

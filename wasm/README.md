# WebAssembly support
Compiled wasm files

## How to run
```
node predict.js
Bonjour à tous. Ceci est du français
[ 0.9735482335090637, '__label__fr' ]
[ 0.014392763376235962, '__label__en' ]
[ 0.0022527812980115414, '__label__la' ]
[ 0.001576810609549284, '__label__vi' ]
[ 0.0015742615796625614, '__label__it' ]
Hello, world. This is english
[ 0.9395676255226135, '__label__en' ]
[ 0.003564052516594529, '__label__pt' ]
[ 0.0033803132828325033, '__label__de' ]
[ 0.0029722510371357203, '__label__ru' ]
[ 0.0026135812513530254, '__label__te' ]
Merhaba dünya. Bu da türkçe
[ 0.8115067481994629, '__label__tr' ]
[ 0.03630346059799194, '__label__az' ]
[ 0.02223432995378971, '__label__de' ]
[ 0.018536636605858803, '__label__jv' ]
[ 0.014385990798473358, '__label__hu' ]
```

## How to build

### Compile from FastText sources
If you want to compile the module again from source please use the provided `Makefile` file and copy it to fastText folder, then build `wasm` target:
```
git clone https://github.com/loretoparisi/fasttext.js.git
git clone https://github.com/facebookresearch/fastText.git
cp fasttext.js/wasm/Makefile fastText/
cd fastText
wasm clean
wasm make
cd webassembly/
cp *.wasm fasttext.js/wasm/
cp fasttext_wasm.js fasttext.js/wasm/
```

### Changes for NodeJS
Apply the following changes to the `fasttext_wasm.js` javascript files: `export default FastTextModule;` => `module.exports = FastTextModule;` (last line).

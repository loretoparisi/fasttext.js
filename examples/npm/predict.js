// LP: ES module imports
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import FastText from 'fasttext.js'

const MODELS_ROOT = path.join(path.dirname(__dirname),'models')
const ft = new FastText({
    predict: { wasm: true }, // set false to do not use wasm
    loadModel: MODELS_ROOT + '/sms_model.bin' // must specifiy filename and ext
})
console.log(ft)

const sample = "You have won a phone! Please apply now!"
const res = await ft.loadSentence(sample)
console.log(res)
await ft.unload()
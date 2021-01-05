# fabricjs-node-img
genera imagenes png y svg

```sh

const fs = require('fs');
const { JSDOM } = require("jsdom");
const { document } = new JSDOM("").window;
const {Canvasnode} = require('fabricjs-node-img');
global.document = document;

(async function() {    
    let jsonFile = await JSON.parse(fs.readFileSync('./json/1.json'));
    let generatePng = new Canvasnode(jsonFile);    
    let loadjson = await generatePng.loadCanvas();    
    console.log(loadjson);
})();

```
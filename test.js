const fs = require('fs');
const { JSDOM } = require("jsdom");
const { document } = new JSDOM("").window;
const {Canvasnode} = require('./index.js');
global.document = document;



(async function() {    
    let jsonFile = await JSON.parse(fs.readFileSync('./json/1.json'));
    let conf =  { 
        "IMAGE" : {"size" : [400, 600, 800, 1000, 2000], 'format' : 'jpg', 'name': "IMAGE_ARTIFY_"}, 
        "SVG" : true,
        'JSON': true,
        'DEST_FOLDER': './file/',
        'JSON_STRING' : jsonFile
    }    
    let generatePng = new Canvasnode(conf);    
    let loadjson = await generatePng.loadCanvas();    
})();

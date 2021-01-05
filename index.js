const fs = require('fs');
var canvas = require("canvas");
var fabric = require("fabric").fabric;
const { LoremIpsum } = require("lorem-ipsum");
var Buffer = require('buffer/').Buffer;

const lorem = new LoremIpsum({
    sentencesPerParagraph: { max: 8, min: 4},
    wordsPerSentence: { max: 16,min: 4 }
});

class Canvasnode{
    constructor(conf){
        this.conf = conf;
        this.virtualCanvas = [];
    }
    async loadCanvas(){
        try {
            let canvasOptions = {
                width: this.virtualCanvas.canvas_width,
                height: this.virtualCanvas.canvas_height,
                backgroundColor: "#ffffff",
            }; 
            this.virtualCanvas = new fabric.Canvas(null, canvasOptions);
            let jsonpromise = await this.loadjson(this.conf.JSON_STRING);    
            let objects = this.virtualCanvas.toJSON().objects;
            for ( let x in objects){
                if( this.virtualCanvas.item(x).type === 'i-text' || 
                    this.virtualCanvas.item(x).type === 'textbox'){
                    this.virtualCanvas.item(x).text = lorem.generateWords(6);
                }
            }
            this.virtualCanvas.renderAll();    
            for(let image of this.conf.IMAGE.size){
                await this.createpng(image);
            }      
            if( this.conf.SVG ){
                await fs.writeFileSync(`${this.conf.DEST_FOLDER}${this.conf.IMAGE.name}.svg`, this.virtualCanvas.toSVG(['uuid','id']));
            }
            if( this.conf.JSON ){
                await fs.writeFileSync(`${this.conf.DEST_FOLDER}${this.conf.IMAGE.name}.json`, JSON.stringify(this.virtualCanvas.toJSON(['uuid','id'])));
            }
            console.log(this.virtualCanvas.toJSON());
            
        } catch (error) {
            return error;
        }
    }

    async  createpng (mult) {
        try{
            return new Promise(async(resolve, reject) => {
                let multipl = mult/this.virtualCanvas.canvas_width;
                let dataURL = await this.virtualCanvas.toDataURL({
                    format: this.conf.IMAGE.format,
                    left: 0,
                    top: 0,
                    width: this.virtualCanvas.canvas_width ,
                    height: this.virtualCanvas.canvas_height ,
                    multiplier: multipl,
                    quality: 0.3
                });   
                dataURL = await dataURL.replace("data:image/png;base64,", "");
                let img  = await  new Buffer(dataURL, 'base64');            
                await fs.writeFileSync(`${this.conf.DEST_FOLDER}${this.conf.IMAGE.name}${mult}_thumb.png`, img, function(err) {                        
                    return err;
                });
                resolve(true); 
            });
        } catch (error) {
            return false;
        }
    }
    async loadjson(json) {
        try {
          return new Promise((resolve, reject) => {
            this.virtualCanvas.loadFromJSON(json, async () => {              
              resolve(true);
            });
          });
        } catch (error) {
          console.error(error);
          return;
        }
    }
}

exports.Canvasnode = Canvasnode;
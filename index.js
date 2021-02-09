var canvas = require("canvas");
var fabric = require("fabric").fabric;
const FileSaver = "file-saver";
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
        } catch (error) {
            return error;
        }
    }

    async toJson(){
        try {
            return this.virtualCanvas.toJSON();
        } catch (error) {
            return true;
        } 
    }

    async donwloadImage(type){
        try {
            this.virtualCanvas.getElement().toBlob(async blob => {
                await this.savePngImage(blob);
                this.dialogSave = false;
            }, type);   
        } catch (error) {
            
        }

    }
    savePngImage(blob) {
        this.loadingDownload = false;
        FileSaver.saveAs(blob, "image.png");
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
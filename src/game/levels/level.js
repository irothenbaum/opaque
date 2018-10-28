const MMCQ = require('../color-map')

class Level {
    constructor(data) {
        this.name = data.name
        this.imageFile = data.image
        this.colorCount = data.colorCount || 8
        this.imageData = Level.imageDataFromImage(this.imageFile, this.colorCount)
    }

    getImageData() {
        return this.imageData
    }

    getColorCount() {
        return this.colorCount
    }

    static imageDataFromImage(imgFile, numberOfColors) {
        let canvas = window.document.createElement('canvas')
        canvas.width = imgFile.width
        canvas.height = imgFile.height

        canvas.getContext('2d').drawImage(imgFile, 0, 0, imgFile.width, imgFile.height)
        let pixelData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;

        // pixel data is a linear array of every pixel represented as a sequence of 4 integers (RGBA)
        // our quantize function wants each pixel to be its own array of length 3 (RGB)
        // so we loop through and re-package the single dimension array into a 2 dimensional one
        let formattedData = [];
        for (let i=0; i<pixelData.length; i+=4) {
            formattedData.push([
                pixelData[i], pixelData[i+1], pixelData[i+2] //NOTE, not i+3 because we don't want alpha channel
            ]);
        }

        // reduce our image colorset
        let cmap = MMCQ.quantize(formattedData, numberOfColors)

        // return the new image data
        return formattedData.map(function(p) {
            return cmap.map(p);
        });
    }
}

module.exports = Level
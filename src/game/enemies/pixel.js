const PixelSprite = require('../sprites/enemies/pixel')
const TC = require('../../../../TwoCylinder/dist/twocylinder')
const Enemy = require('enemy')

class Pixel extends Enemy {
    static get healthMultiplier() { return 1 }
    static get size() { return 20 }

    constructor(options) {
        options.bounding = new TC.Engine.BoundingBox({
            width: Pixel.size,
            height: Pixel.size,
        })
        // they share a bounding
        options.appearance = new PixelSprite({
            bounding: options.bounding
        })
        super(options)
    }
}

module.exports = Pixel
const TC = require('../../../../TwoCylinder/dist/twocylinder')

class Enemy extends TC.Engine.Entity {
    static get healthMultiplier() { return 1 }
    static get HP_CYAN() { return 'c' }
    static get HP_MAGENTA() { return 'm' }
    static get HP_YELLOW() { return 'y' }

    constructor(options) {
        super(options)

        this.setPosition(options.x, options.y)
        this.__pixelValue = options.pixel
        this.__pixelIndex = options.index

        this.__health = getHealthFromRGBValues(this.__pixelValue, this.constructor.healthMultiplier)
    }

    getHP(color) {
        if (!color) {
            return this.__health
        } else {
            return this.__health[color]
        }
    }

    getColorStyle() {
        return 'rgb(' + this.__pixelValue[0] + ',' + this.__pixelValue[1] + ',' + this.__pixelValue[2] + ')'
    }
}

function getHealthFromRGBValues(rgbArray, maximumValue) {
    let ratio = maximumValue / 255
    return {
        c: maximumValue - Math.round(rgbArray[0] * ratio),
        m: maximumValue - Math.round(rgbArray[1] * ratio),
        y: maximumValue - Math.round(rgbArray[2] * ratio)
    }
}

module.exports = Enemy

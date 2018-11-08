const TC = require('../../../TwoCylinder/dist/twocylinder')
const PlayerSprite = require('./sprites/player')

class Player extends TC.Engine.Entity {
    constructor(options) {
        options.bounding = new TC.Engine.BoundingBox({
            origin_x: 350,
            origin_y: 600,
            width: 30,
            height: 60,
        })
        // they share a bounding
        options.appearance = new PlayerSprite({
            bounding: options.bounding
        })
        super(options)
    }

    getAmmoColor(opacity) {
        if (opacity === undefined) {
            opacity = 1
        }

        if (opacity !== 1) {
            return PlayerSprite.COLOR_CYAN.replace(',1)',','+opacity+')');
        } else {
            return PlayerSprite.COLOR_CYAN
        }
    }

    preStep() {
        super.preStep(...arguments)

        let newDirection = this.getDirection() + (Math.PI/180)
        this.setDirection(newDirection % TC.Utilities.Constants.TAU)
    }
}

module.exports = Player
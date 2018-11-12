const TC = require('../../../TwoCylinder/dist/twocylinder')
const PlayerSprite = require('./sprites/player')

class Player extends TC.Engine.Entity {
    constructor(options) {
        options.bounding = new TC.Engine.BoundingBox({
            origin_x: 350,
            origin_y: 600,
            width: 50,
            height: 88,
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

        // TODO: Determine the actual color based on what ammo is being used
        let color = PlayerSprite.COLOR_CYAN;

        if (opacity !== 1) {
            return color.replace(',1)',','+opacity+')');
        } else {
            return color
        }
    }
}

module.exports = Player
const TC = require('../../../../TwoCylinder/dist/twocylinder')

class MouseControl extends TC.IO.Touch {
    constructor (options) {
        super(Object.assign({
            double : 0
            ,tap : 0
            ,tap_distance : 0
        }, options))
        this.__player = options.player

        this.onMove((evt) => {
            this.__player.setDirection(TC.Utilities.Geometry.angleToPoint(this.__player.getBounding().getCenter(), evt.getWorldCenter()))
        })
    }
}

module.exports = MouseControl
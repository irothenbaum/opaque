const PixelSprite = require('../sprites/enemies/pixel')
const TC = require('../../../../TwoCylinder/dist/twocylinder')
const Enemy = require('./enemy')

const MAX_SPEED = 5
const NEAR_MARGIN = 100

class Pixel extends Enemy {
    static get healthMultiplier() { return 1 }
    static get size() { return 30 }

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

        // face straight down
        this.setDirection(Math.PI / 2)
        this.targetSpeed = 3
        this.setSpeed(3)

    }

    postStep() {
        super.postStep(...arguments)

        if (this.getSpeed() === this.targetSpeed) {
            this.targetSpeed = Math.round(MAX_SPEED * Math.random())
            let straightDown = Math.PI / 2
            this.targetDirection = (Math.random() * Math.PI / 2) + (Math.PI / 4)

            if (this.getPosition().x < NEAR_MARGIN && this.targetDirection > straightDown) {
                this.targetDirection = straightDown
            } else if (this.getPosition().x > (this.getWorld().getBounding().width - NEAR_MARGIN) && this.targetDirection < straightDown) {
                this.targetDirection = straightDown
            }
        } else {
            let difference = this.targetSpeed - this.getSpeed()
            let isLessThan = difference < 0
            let maxAmount = 0.05
            this.setSpeed(this.getSpeed() + ((isLessThan ? -1 : 1) * Math.min(maxAmount, Math.abs(difference))))

            difference = this.targetDirection - this.getDirection()
            isLessThan = difference < 0
            this.setDirection(this.getDirection() + ((isLessThan ? -1 : 1) * Math.min(maxAmount, Math.abs(difference))))
        }
    }
}

module.exports = Pixel
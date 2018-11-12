const TC = require('../../../../TwoCylinder/dist/twocylinder')

const muzzleWidth = 5
const muzzleHeight = muzzleWidth * 4
const barrelWidth = 17
const barrelHeight = barrelWidth * 3
const stockWidth = 25
const stockHeight = stockWidth * 1.4
const turretRadius = 24
const visionWidth = barrelWidth
const visionHeight = visionWidth * 1.4

class Player extends TC.Engine.Appearance {
    static get COLOR_CYAN() { return 'rgba(0,255,255,1)'; }
    static get COLOR_MAGENTA() { return 'rgba(255,0,255,1)'; }
    static get COLOR_YELLOW() { return 'rgba(255,255,0,1)'; }

    static get COLOR_BLUE() { return 'rgba(0,0,255,1)'; }
    static get COLOR_RED() { return 'rgba(255,0,0,1)'; }
    static get COLOR_GREEN() { return 'rgba(0,255,0,1)'; }

    static get COLOR_BLACK() { return 'rgba(0,0,0,1)'; }

    constructor(options) {
        super(options)
    }

    draw (canvas, x, y, entity) {
        const {
            context,
            width,
            height,
            originX,
            originY
        } = this.__getDrawConsts(...arguments)

        // the difference between the top/left of our drawing and the center of our entity
        let ydiff = y - originY;
        let xdiff = x - originX;
        context.translate(x, y)
        // we rotate an extra 90degrees because we draw with 0 at 12:00, but really 0 degrees is at 3:00 (on a clock)
        context.rotate(entity.getDirection() + Math.PI/2)
        this.drawTurret(context, 0, 0)
        this.drawMuzzle(context, -muzzleWidth / 2, -ydiff)
        this.drawBarrel(context, -barrelWidth / 2, -ydiff + muzzleHeight)
        this.drawStock(context, -stockWidth / 2, -ydiff + muzzleHeight + barrelHeight)
        this.drawVision(context, barrelWidth / 2, -ydiff + muzzleHeight + barrelHeight, entity)
        if (window.DEBUG) {
            context.beginPath()
            context.strokeStyle = '#777';
            context.fillStyle = 'rgba(0,0,0,0.1)'
            // Shift back the muzzle height -- @see __getDrawConsts
            context.rect(-xdiff, -ydiff + muzzleHeight, width, height);
            context.fill()
            context.stroke()
            context.closePath()
        }
        context.rotate(-entity.getDirection() - Math.PI/2)
        context.translate(-x, -y)

    }

    drawMuzzle(context, originX, originY) {
        context.beginPath()
        context.fillStyle = '#333'
        context.rect(originX, originY, muzzleWidth, muzzleHeight)
        context.fill()
    }

    drawBarrel(context, originX, originY) {
        context.beginPath()
        let gradient = context.createLinearGradient(originX, originY, originX + barrelWidth, originY)
        gradient.addColorStop(0, '#ddd')
        gradient.addColorStop(.33, '#fff')
        gradient.addColorStop(.66, '#fff')
        gradient.addColorStop(1, '#ddd')
        context.fillStyle = gradient
        context.rect(originX, originY, barrelWidth, barrelHeight)
        context.fill()
    }

    drawStock(context, originX, originY) {
        context.beginPath()
        context.fillStyle = '#fff'
        context.strokeStyle = '#ddd'
        context.rect(originX, originY, stockWidth, stockHeight)
        context.fill()
        context.stroke()
    }

    drawTurret(context, turretCenterX, turretCenterY) {
        context.beginPath()
        context.arc(turretCenterX, turretCenterY, turretRadius, 0, TC.Utilities.Constants.TAU)
        context.fillStyle = '#ddd'
        context.strokeStyle = '#ccc'
        context.fill()
        context.stroke()
    }

    drawVision(context, originX, originY, entity) {
        let bulbRadius = visionWidth/2
        let bulbX = originX + bulbRadius
        let bulbY = originY + bulbRadius

        // draw the bulb + shine
        context.beginPath()
        let shine = context.createRadialGradient(bulbX, bulbY, bulbRadius, bulbX, bulbY, visionWidth);
        shine.addColorStop(0, entity.getAmmoColor())
        shine.addColorStop(0.1, entity.getAmmoColor(0.5))
        shine.addColorStop(1, entity.getAmmoColor(0))
        context.arc(bulbX, bulbY, visionWidth, 0, TC.Utilities.Constants.TAU)
        context.fillStyle = shine
        context.fill()

        // draw the camera body
        context.beginPath()
        context.fillStyle = '#fff'
        context.strokeStyle = '#ddd'
        context.rect(originX, originY + bulbRadius, visionWidth, visionHeight)
        context.fill()
        context.stroke()
    }

    __getDrawConsts(canvas, x, y, entity) {
        let box = this.getBounding().getContainingRectangle()
        return {
            context: canvas.getContext('2d'),
            width: box.width,
            height: box.height,
            originX : box.origin_x,

            // we don't want to include the muzzle in our collision box so we shift the entire drawing up that amount
            // and the bounding box is sized to include the rest of the turret
            originY : box.origin_y - muzzleHeight
        }
    }
}

module.exports = Player
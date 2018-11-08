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

        let turretCenter = y + (2 * turretRadius)
        let ydiff = turretCenter - originY;
        context.translate(x, turretCenter)
        context.rotate(entity.getDirection())
        this.drawTurret(context, 0, 0)
        this.drawMuzzle(context, -muzzleWidth / 2, -ydiff)
        this.drawBarrel(context, -barrelWidth / 2, -ydiff + muzzleHeight)
        this.drawStock(context, -stockWidth / 2, -ydiff + muzzleHeight + barrelHeight)
        this.drawVision(context, barrelWidth / 2, -ydiff + muzzleHeight + barrelHeight, entity)
        context.rotate(-entity.getDirection())
        context.translate(-x, -turretCenter)
    }

    drawMuzzle(context, originX, originY) {
        context.beginPath()
        context.fillStyle = '#111'
        context.rect(originX, originY, muzzleWidth, muzzleHeight)
        context.fill()
    }

    drawBarrel(context, originX, originY) {
        context.beginPath()
        let gradient = context.createLinearGradient(originX, originY, originX + barrelWidth, originY)
        gradient.addColorStop(0, '#555')
        gradient.addColorStop(.33, '#aaa')
        gradient.addColorStop(.66, '#aaa')
        gradient.addColorStop(1, '#555')
        context.fillStyle = gradient
        context.rect(originX, originY, barrelWidth, barrelHeight)
        context.fill()
    }

    drawStock(context, originX, originY) {
        context.beginPath()
        context.fillStyle = '#ddd'
        context.strokeStyle = '#333'
        context.rect(originX, originY, stockWidth, stockHeight)
        context.fill()
        context.stroke()
    }

    drawTurret(context, turretCenterX, turretCenterY) {
        context.beginPath()
        context.arc(turretCenterX, turretCenterY, turretRadius, 0, TC.Utilities.Constants.TAU)
        context.fillStyle = '#444'
        context.strokeStyle = '#111'
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
        context.fillStyle = '#ddd'
        context.strokeStyle = '#333'
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
            originY : box.origin_y
        }
    }
}

module.exports = Player
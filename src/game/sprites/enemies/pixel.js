const EnemySprite = require('./enemy')

class Pixel extends EnemySprite {
    drawNormal(canvas, x, y, entity) {
        const {
            context,
            sideSize,
            startingX,
            startingY,
            borderRadius
        } = this.__getDrawConsts(...arguments)

        this.drawRoundedRectangle(context, startingX, startingY, sideSize, sideSize, entity.getColorStyle(), borderRadius)
    }
    drawDamaged(canvas, x, y, entity) {

    }
    drawHealth(canvas, x, y, entity) {
        const {
            context,
            sideSize,
            startingX,
            startingY,
            borderRadius
        } = this.__getDrawConsts(...arguments)

        const barWidth = sideSize/3

        // draw a full black rounded rectangle
        this.drawRoundedRectangle(context, startingX, startingY, sideSize, sideSize, '#000000', borderRadius)

        // on top of that, we draw the health ------------
        // first the Cyan healthbar
        if (entity.getHP(entity.constructor.HP_CYAN) > 0) {
            let cyanBorders = [borderRadius, 0, 0, borderRadius]
            let cyanStartingChange = 0

            if (entity.getHP(entity.constructor.HP_CYAN) !== entity.constructor.healthMultiplier) {
                cyanBorders[0] = 0
                cyanStartingChange = sideSize * ( 1 - (entity.getHP(entity.constructor.HP_CYAN) / entity.constructor.healthMultiplier))
            }
            this.drawRoundedRectangle(context, startingX, startingY + cyanStartingChange, barWidth, sideSize - cyanStartingChange, EnemySprite.COLOR_CYAN, cyanBorders)
        }

        if (entity.getHP(entity.constructor.HP_MAGENTA) > 0) {
            let magentaStartingChange = 0

            if (entity.getHP(entity.constructor.HP_MAGENTA) !== entity.constructor.healthMultiplier) {
                magentaStartingChange = sideSize * (1 - (entity.getHP(entity.constructor.HP_MAGENTA) / entity.constructor.healthMultiplier))
            }

            // draw a regular rectangle for the middle one
            context.fillStyle = EnemySprite.COLOR_MAGENTA
            context.rect(startingX + barWidth, startingY + magentaStartingChange, barWidth, sideSize - magentaStartingChange)
            context.fill()
        }

        if (entity.getHP(entity.constructor.HP_YELLOW) > 0) {
            let yellowBorders = [0, borderRadius, borderRadius, 0]
            let yellowStartingChange = 0

            if (entity.getHP(entity.constructor.HP_YELLOW) !== entity.constructor.healthMultiplier) {
                yellowBorders[1] = 0
                yellowStartingChange = sideSize * ( 1 - (entity.getHP(entity.constructor.HP_YELLOW) / entity.constructor.healthMultiplier))
            }
            this.drawRoundedRectangle(context, startingX + (2 * barWidth), startingY + yellowStartingChange, barWidth, sideSize - yellowStartingChange, EnemySprite.COLOR_YELLOW, yellowBorders)
        }
    }
    drawDying(canvas, x, y, entity) {

    }

    drawRoundedRectangle(context, startingX, startingY, width, height, color, radius) {
        // Re-purposed from https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
        if (typeof radius === 'number') {
            radius = [radius, radius, radius, radius]
        }

        // radius is an array of radiuses
        //  0__1
        //  |__|
        //  3  4

        context.beginPath()
        context.fillStyle = color
        context.moveTo(startingX + radius[0], startingY)
        context.lineTo(startingX + width - radius[1], startingY)
        context.quadraticCurveTo(startingX + width, startingY, startingX + width, startingY + radius[1])
        context.lineTo(startingX + width, startingY + height - radius[2])
        context.quadraticCurveTo(startingX + width, startingY + height, startingX + width - radius[2], startingY + height)
        context.lineTo(startingX + radius[3], startingY + height)
        context.quadraticCurveTo(startingX, startingY + height, startingX, startingY + height - radius[3])
        context.lineTo(startingX, startingY + radius[0])
        context.quadraticCurveTo(startingX, startingY, startingX + radius[0], startingY)
        context.closePath()
        context.fill()
    }

    __getDrawConsts(canvas, x, y, entity) {
        const sideSize = this.getBounding().width
        const halfSide = (sideSize/2)
        return {
            context: canvas.getContext('2d'),
            sideSize: sideSize,
            // x and y represent the center of our drawing, but our drawing starts at the corner so we need to move up and over half the length of a side
            startingX : x - halfSide,
            startingY : y - halfSide,
            borderRadius: 3
        }
    }
}

module.exports = Pixel
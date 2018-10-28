const EnemySprite = require('./enemy')

class Pixel extends EnemySprite {
    drawNormal(canvas, x, y, entity) {
        let context = canvas.getContext('2d')
        let sideSize = this.getBounding().width
        let borderRadius = 3

        // Re-purposed from https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
        context.beginPath();
        context.fillStyle = entity.getColorStyle();
        context.moveTo(x + borderRadius, y);
        context.lineTo(x + sideSize - borderRadius, y);
        context.quadraticCurveTo(x + sideSize, y, x + sideSize, y + borderRadius);
        context.lineTo(x + sideSize, y + sideSize - borderRadius);
        context.quadraticCurveTo(x + sideSize, y + sideSize, x + sideSize - borderRadius, y + sideSize);
        context.lineTo(x + borderRadius, y + sideSize);
        context.quadraticCurveTo(x, y + sideSize, x, y + sideSize - borderRadius);
        context.lineTo(x, y + borderRadius);
        context.quadraticCurveTo(x, y, x + borderRadius, y);
        context.closePath();
        context.fill()
    }
    drawDamaged(canvas, x, y, entity) {

    }
    drawHealth(canvas, x, y, entity) {

    }
    drawDying(canvas, x, y, entity) {

    }
}

module.exports = Pixel
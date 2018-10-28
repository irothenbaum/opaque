const TC = require('../../../../../TwoCylinder/dist/twocylinder')
const EnemyEntity = require('../../enemies/enemy')

function hasHealthChanged(health1, health2) {
    if (!health2 || !health1) {
        return false
    }
    return !(health1[EnemyEntity.HP_CYAN] === health2[EnemyEntity.HP_CYAN]
        && health1[EnemyEntity.HP_MAGENTA] === health2[EnemyEntity.HP_MAGENTA]
        && health1[EnemyEntity.HP_YELLOW] === health2[EnemyEntity.HP_YELLOW])
}

function hasHealthRemaining(health) {
    return !(health[EnemyEntity.HP_CYAN] === 0
        && health[EnemyEntity.HP_MAGENTA] === 0
        && health[EnemyEntity.HP_YELLOW] === 0)
}

class Enemy extends TC.Engine.Appearance {
    constructor(options) {
        super(options)

        this.memoizedHealth = undefined
        this.drawingAnimation = undefined
        this.showingHP = false
    }

    draw (canvas, x, y, entity) {
        if (typeof this.drawingAnimation === 'function') {
            return this.drawingAnimation(...arguments)
        }

        let currentHealth = entity.getHP()
        if (hasHealthChanged(currentHealth, this.memoizedHealth)) {
            this.drawDamaged(...arguments)
        } else if (this.showingHP) {
            this.drawHealth(...arguments)
        } else if (!hasHealthRemaining(currentHealth)) {
            this.drawDying()
        } else {
            this.drawNormal(...arguments)
        }

        this.memoizedHealth = currentHealth
    }

    drawNormal(canvas, x, y, entity) {}
    drawDamaged(canvas, x, y, entity) {}
    drawHealth(canvas, x, y, entity) {}
    drawDying(canvas, x, y, entity) {}
}

module.exports = Enemy
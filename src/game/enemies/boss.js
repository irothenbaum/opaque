const Enemy = require('enemy')

class Boss extends Enemy {
    static get healthMultiplier() { return 10 }
}

module.exports = Boss
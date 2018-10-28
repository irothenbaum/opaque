const Enemy = require('enemy')

class Advanced extends Enemy {
    static get healthMultiplier() { return 3 }
}

module.exports = Advanced
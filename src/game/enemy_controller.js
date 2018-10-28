const TC = require('../../../TwoCylinder/dist/twocylinder')
const PixelEnemy = require('./enemies/pixel')

const ENEMY_CREATE_DELAY_CONSTANT = 90; // 3 seconds

const ENEMY_TYPE_PIXEL = 'pixel'
const ENEMY_TYPE_ADVANCED = 'advanced'
const ENEMY_TYPE_BOSS = 'boss'

class EnemyController extends TC.Engine.Controller {
    constructor(options) {
        super(options)

        this.levelInstance = options.level

        this.digestLevelData()

        // create a bunch of enemies from it (or representation of enemies
        this.enemyCreationTimeout = undefined
        this.diceSides = ENEMY_CREATE_DELAY_CONSTANT

        this.onLevelEnd = options.onLevelEnd
    }

    step(worldClock) {
        super.step(worldClock)
        if (this.enemyCreationTimeout > 0) {
            this.enemyCreationTimeout--;
            return;
        }
        // roll a dice to determine if we should create an enemy / group of enemies
        if (Math.floor(Math.random() * this.diceSides) === 0) {
            // if we decide to create an enemy
            let NUMBER_CREATED = 1 + Math.round(( 1 - (this.enemyQueue.length / this.startingQueueSize)) * this.levelInstance.getColorCount());

            // create enemy
            while (NUMBER_CREATED > 0) {
                this.createEnemyInstanceFromEnemyData(this.enemyQueue.pop())
                NUMBER_CREATED--
            }

            this.enemyCreationTimeout = ENEMY_CREATE_DELAY_CONSTANT * NUMBER_CREATED
        }
    }

    postStep(worldClock) {
        super.postStep(worldClock)
    }

    digestLevelData() {
        this.enemyQueue = []
        let colors = {}
        let imageData = this.levelInstance.getImageData()
        this.startingQueueSize = imageData.length
        let advancedEnemyProportion = this.startingQueueSize / this.levelInstance.getColorCount()

        imageData.forEach((pixel, i) => {
            let colorKey = pixel.join(':')
            if (!colors[colorKey]) {
                colors[colorKey] = 0
            }

            // add one to represent this current pixel
            // we're going to use this to basically create more powerful enemies later into the level
            colors[colorKey]++

            let enemy = {
                pixel: pixel,
                index: i
            }
            // determine what type of enemy to make
            if (colors[colorKey] < advancedEnemyProportion) {
                // make a normal pixel
                enemy.type = ENEMY_TYPE_PIXEL
            } else if (colors[colorKey] < (2 * advancedEnemyProportion)) {
                // make an advanced enemy??
                // roll a dice re: what kind
                enemy.type = ENEMY_TYPE_ADVANCED
            } else {
                // make a boss -- reduce the count proportionally to make it less likely to happen again
                // we don't want more than 1 boss per 10 advanced enemies
                colors[colorKey] -= 10
                enemy.type = ENEMY_TYPE_BOSS
            }

            this.enemyQueue.push(enemy)
        })

        // now reverse the enemy queue because we're going to be popping off the top
        // and we constructed it such that the advanced enemies and bosses are at the end
        this.enemyQueue.reverse()
    }

    // this function should determine the type of enemy to create (based on the enemy data
    createEnemyInstanceFromEnemyData(enemyData) {
        let enemyInstance

        let worldWidth = this.getWorld().getBounding().width
        enemyData.x = 0.8 * worldWidth * Math.random() + (0.1 * worldWidth)
        enemyData.y = -100

        switch (enemyData.type) {
            case ENEMY_TYPE_PIXEL:
                enemyInstance = new PixelEnemy(enemyData)
                break;
        }

        if (!enemyInstance) {
            throw "Invalid enemy data"
        }

        this.getWorld().addInstance(enemyInstance)
    }

    exit() {
        this.getWorld().removeAllInstance()
        this.getWorld().removeAllParticleEmitters()
        console.log("EXITED ENEMY CONTROLLER")
    }
}

const enemyDataStruct = {
    type: '', // the type of this enemy
    pixel: '', // the pixel value (health) for this enemy
    index: '', // this pixel's index in the array
}

module.exports = EnemyController
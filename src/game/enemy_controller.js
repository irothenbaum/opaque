const TC = require('../../../TwoCylinder/dist/twocylinder')

const ENEMY_CREATE_DELAY_CONSTANT = 30;

const ENEMY_TYPE_PIXEL = 'pixel'

class EnemyController extends TC.Engine.Controller {
    constructor(options) {
        super(options)

        this.enemyQueue = []
        this.digestImageData(options.image)

        // create a bunch of enemies from it (or representation of enemies
        this.enemyCreationTimeout = undefined
        this.refreshDiceSides()
    }

    step(worldClock) {
        if (this.enemyCreationTimeout > 0) {
            this.enemyCreationTimeout--;
            return;
        }
        // roll a dice to determine if we should create an enemy /  group of enemies
        if (Math.floor(Math.random() * this.diceSides) === 0) {
            // if we decide to create an enemy
            let NUMBER_CREATED = 0;

            // create enemy
            while (NUMBER_CREATED > 0) {
                this.createEnemyFromEnemyData(this.enemyQueue.pop())
            }

            this.enemyCreationTimeout = ENEMY_CREATE_DELAY_CONSTANT * NUMBER_CREATED
        }
    }

    postStep(worldClock) {
        // reduce the size of the dice according to how many enemies are left
    }

    refreshDiceSides() {
        this.diceSides = 1000; // some relationship to number of enemies left?
    }

    digestImageData(image) {
        this.enemyQueue = []
    }

    // this function should determine the type of enemy to create (based on the enemy data
    createEnemyFromEnemyData(enemyData) {
        let enemyInstance

        switch (enemyData.type) {
            case ENEMY_TYPE_PIXEL:
                enemyInstance = new PixelEnemy()
                break;
        }

        this.world.addInstace(enemyInstance)
    }
}
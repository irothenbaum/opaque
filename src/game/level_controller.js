const TC = require('../../../TwoCylinder/dist/twocylinder')
const EnemyController = require('./enemy_controller')
const Level = require('./levels/level')

const PATH_TO_LEVEL_IMAGES = './src/game/levels/images/'

class LevelController extends TC.Engine.Controller {
    constructor(options) {
        super(options)

        this.currentLevel = options.currentLevel || -1 // we start at -1 so when we advance it starts at 0
        this.levelIsActive = false
        this.levelIsLoading = false
        this.enemyController = null
    }

    preStep(worldClock) {
        super.preStep(worldClock)

        if (!this.levelIsActive && !this.levelIsLoading) {
            this.advanceLevel()
        }
    }

    step(worldClock) {
        super.step(worldClock)
    }

    handleLevelEnd() {
        console.log("LEVEL END")
        // TODO: what do we do about the score? We should show how much of the image they got done
        this.enemyController.exit()
        delete this.enemyController
        delete this.level
        this.levelIsActive = false
    }

    advanceLevel() {
        this.currentLevel++

        switch (this.currentLevel) {
            case 0:
                // we may want to make a custom enemy controller for certain levels
            default:
                let levelData = LEVELS[this.currentLevel]

                let imgFile = new Image()

                // load the image
                imgFile.crossOrigin = "Anonymous"
                imgFile.onload = () => {
                    this.levelIsLoading = false
                    levelData.image = imgFile
                    this.level = new Level(levelData)
                    this.enemyController = new EnemyController({
                        level: this.level,
                        onLevelEnd: this.handleLevelEnd
                    })
                    this.getWorld().addController(this.enemyController)
                    this.levelIsActive = true
                }
                imgFile.src = PATH_TO_LEVEL_IMAGES + levelData.imageName
                break;
        }

        this.levelIsLoading = true
    }
}

const LEVELS = [
    {
        name: 'Printer Test',
        colorCount: 3,
        imageName: 'cmy.png'
    }
]

module.exports = LevelController
const TC = require('../../TwoCylinder/dist/twocylinder')
const GameSettings = require('./game_settings')
const LevelController = require('./game/level_controller')
const Player = require('./game/player')

let canvas;

const STATE_MENU = 'menu'
const STATE_STORY = 'story'
const STATE_GAME = 'game'

const desiredWidth = 800
const desiredHeight = 1300

class OpaqueGame extends TC.Engine.Game {
    init(window) {
        canvas = window.document.getElementById('world')
        this.gameSettings = new GameSettings()
        // TODO: load the settings from session?

        this.enter(STATE_MENU)
    }

    enter(state) {
        this.beforeChange()

        switch (state) {
            case STATE_MENU:
                this.enterMenu()
                break;
            case STATE_GAME:
                this.enterGame()
                break;
            case STATE_STORY:
                this.enterStory()
                break;
        }

        this.afterChange()
    }

    beforeChange() {
        if (this.getWorld()) {
            this.getWorld().exit()
            this.setWorld(null)
        }
    }

    afterChange() {
        this.getWorld().start()
    }

    enterGame() {
        let gameBackground = new TC.Engine.Background({
            color: '#ffffff'
        })

        let world = new TC.Engine.World({
            fps: 30,
            width: desiredWidth,
            height: desiredHeight,
            background: gameBackground
        })

        let dimensions = getScreenDimensions()
        let view = new TC.Engine.View({
            canvas: canvas,
            resolution: dimensions.scale,
            bounding: world.getBounding()
        })

        world.addView(view)

        // create our player
        this.player = new Player({})
        world.addInstance(this.player)

        // create our levelController
        this.levelController = new LevelController({world: world})
        world.addController(this.levelController)

        // create our hud

        // create our IO

        this.setWorld(world)
    }

    enterMenu() {
        let menuBackground = new TC.Engine.Background({
            color: '#77ff77'
        })

        let world = new TC.Engine.World({
            fps: 30,
            width: desiredWidth,
            height: desiredHeight,
            background: menuBackground
        })

        let dimensions = getScreenDimensions()
        let view = new TC.Engine.View({
            canvas: canvas,
            resolution: dimensions.scale,
            bounding: world.getBounding()
        })

        world.addView(view)

        // TODO: create the items + io / buttons

        this.setWorld(world)
    }

    enterStory() {
        alert("DO THIS")
    }
}

function getScreenDimensions() {
    // if our screen is thinner than the desired, we need to limit by width
    if ( (desiredWidth / desiredHeight) > (window.innerWidth / window.innerHeight) ) {
        let scale = (window.innerWidth / desiredWidth)
        return {
            width: window.innerWidth,
            height: scale * desiredHeight,
            scale: scale
        }
    } else {
        // we limit by height
        let scale = (window.innerHeight / desiredHeight)
        return {
            height: window.innerHeight,
            width: scale * desiredWidth,
            scale: scale
        }
    }
}

window.OpaqueGame = OpaqueGame
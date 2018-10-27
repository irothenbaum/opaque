const TC = require('../../TwoCylinder/dist/twocylinder')
const GameSettings = require('./game_settings')

let canvas;

const STATE_MENU = 'menu'
const STATE_STORY = 'story'
const STATE_GAME = 'game'

class OpaqueGame extends TC.Engine.Game {
    init(window) {
        canvas = window.document.getElementById('world')
        this.enter(STATE_MENU)
        this.gameSettings = new GameSettings()
        // TODO: load the settings from session?
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
        }
    }

    afterChange() {
        this.getWorld().start()
    }

    enterGame() {
        let gameBackground = new TC.Engine.Background({
            color: '#ffffff'
        })

        let dimensions = getScreenDimensions()
        let world = new TC.Engine.World({
            fps: 30,
            width: dimensions.width,
            height: dimensions.height,
            background: gameBackground
        })

        let view = new TC.Engine.View({
            canvas: canvas,
            resolution: 1,
            bounding: world.getBounding()
        })

        world.addView(view)
        this.setWorld(world)

        // create our player
        world.addInstance()

        // create our levelController

        // create our hud

        // create our IO
    }

    enterMenu() {
        let menuBackground = new TC.Engine.Background({
            color: '#ff7777'
        })

        let dimensions = getScreenDimensions()
        let world = new TC.Engine.World({
            fps: 30,
            width: dimensions.width,
            height: dimensions.height,
            background: menuBackground
        })

        let view = new TC.Engine.View({
            canvas: canvas,
            resolution: 1,
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
    let desiredWidth = 800
    let desiredHeight = 1300

    // if our screen is thinner than the desired, we need to limit by width
    if ( (desiredWidth / desiredHeight) > (window.innerWidth / window.innerHeight) ) {
        return {
            width: window.innerWidth,
            height: (window.innerWidth/desiredWidth) * desiredHeight
        }
    } else {
        // we limit by height
        return {
            height: window.innerHeight,
            width: (window.innerHeight / desiredHeight) * desiredWidth
        }
    }
}

window.OpaqueGame = OpaqueGame
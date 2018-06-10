const Game = require('./game')

window.onLoad = function() {
    let canvas = window.document.getElementById('world')

    window.game = new Game({
        canvas: canvas,
        width: parseInt(window.getComputedStyle(canvas).width),
        height: parseInt(window.getComputedStyle(canvas).height)
    })

    window.game.start();
}

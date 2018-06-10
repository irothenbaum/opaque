const TC = require('../twocylinder')

const Game = TC.Engine.Game.extend({
    initialize(options) {
        let world = new TC.Engine.World({
            fps: 30,
            width: options.width,
            height: options.height
        });
        this.viewport = new TC.Engine.View({
            canvas : options.canvas
            ,bounding : new TC.Engine.BoundingBox({
                width : options.width
                ,height : options.height
                ,origin_x : 0
                ,origin_y : 0
            })
        });
        world.addView(this.viewport);
        world.setBackground(new TC.Engine.Background({color:'#691E3E'}));

        this.setWorld(world);
    },
})

module.exports = Game
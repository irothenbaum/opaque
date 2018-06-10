(function (root, factory) {if(typeof module === "object" && module.exports){module.exports = factory(require("underscore"));} else if(typeof define === "function" && define.amd){define("TwoCylinder",["underscore"], factory);} else {root["TwoCylinder"] = factory(root._);}}(this, function(_) {return new function(){var TwoCylinder = this;this.Engine = {};this.Entities = {};this.IO = {};this.Sprites = {};this.Utilities = {};
/*
    This script contains helper objects and functions that can be used by all classes
*/

(function(){
    function x(){};
    
    /* 
     * This extend function was based off of Backbone's extend function because it's so beautiful
     * http://backbonejs.org/
     * It uses the Surrogate pattern to inherit objects 
     * The biggest difference is that this version maintains a complete inheritance chain
     * in conjunction with the _super function, we can simulate true OOP inheritance
     */
    x.extend = function(protoProps, staticProps) {
        var parent = this;
        var child;
        
        // The constructor function for the new subclass is either defined by you
        // (the "initialize" property in your `extend` definition), or defaulted
        // by us to simply call the parent constructor.
        child = function(){
            if (protoProps && _.has(protoProps, 'initialize')) {
                return protoProps.initialize.apply(this, arguments);
            }else{
                return parent.apply(this, arguments);
            }
        };
        
        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function and add the prototype properties.
        child.prototype = _.create(parent.prototype, protoProps);
        child.prototype.constructor = child;
        
        // here we construct the complete inheritance chain for this new class 
        child.parents = [];
        if(parent.parents){
            for(var i=0; i<parent.parents.length; i++){
                child.parents.push(parent.parents[i]);
            }
        }
        
        // we don't want x, we want Root to be the origin class
        if(parent !== x){
            child.parents.push(parent);
        }

        return child;
    };
    
    
    TwoCylinder.Engine.Root = x.extend({
        _super : function(functionName){
            this.parentalCount = this.parentalCount ? this.parentalCount : 1;
            
            var thisParentPosition = this.constructor.parents.length - this.parentalCount;
            
            if(thisParentPosition >= 0 && this.constructor.parents[thisParentPosition].prototype[functionName]){
                this.parentalCount++;
                 var retVal = this.constructor.parents[thisParentPosition].prototype[functionName].apply(this,_.rest(arguments));
                 this.parentalCount = null;
                 return retVal;
            }else{
                this.parentalCount = null;
            }
        }
    });

})();
// TODO:
// lineCollidesBox
// lineCollidesLine
// boxCollidesLine

TwoCylinder.Engine.Geometry = (function(){
    var Geometry = {
/***************************************************
 * BOXES
 ***************************************************/
        boxCollidesBox : function(box1, box2){
            // both box1 and box 2 must have { x, y, width, height } properties
            // if any part of box1's X is within box2's
            var xOverlap = (
                ( 
                    ( box1.origin_x <= box2.origin_x )
                    && 
                    ( (box1.origin_x + box1.width) > box2.origin_x )
                )
                ||
                ( 
                    ( box2.origin_x <= box1.origin_x )
                    && 
                    ( (box2.origin_x + box2.width) > box1.origin_x )
                )
            );
            var yOverlap = (
                ( 
                    ( box1.origin_y <= box2.origin_y ) 
                    && 
                    ( (box1.origin_y + box1.height) > box2.origin_y )
                )
                ||
                ( 
                    ( box2.origin_y <= box1.origin_y )
                    && 
                    ( (box2.origin_y + box2.height) > box1.origin_y )
                )
            );
            
            return xOverlap && yOverlap;
        }
        ,boxCollidesCircle : function(box, circle){
            var point1 = {x:box.origin_x, y:box.origin_y};
            var point2 = {x:box.origin_x + box.width, y:box.origin_y};
            var point3 = {x:box.origin_x + box.width, y:box.origin_y + box.height};
            var point4 = {x:box.origin_x, y:box.origin_y + box.height};
            
            var line1 = [point1,point2];
            var line2 = [point2,point3];
            var line3 = [point3,point4];
            var line4 = [point4,point1];
            
            var retVal =  
                Geometry.pointCollidesBox(circle, box) 
                || Geometry.lineCollidesCircle(line1, circle, true)
                || Geometry.lineCollidesCircle(line2, circle, true) 
                || Geometry.lineCollidesCircle(line3, circle, true)  
                || Geometry.lineCollidesCircle(line4, circle, true);
            
            return retVal;
        }
        ,boxCollidesPoint : function(box, point){
            return (
                (
                    ( point.x >= box.origin_x ) 
                    && 
                    ( (box.origin_x + box.width) >= point.x )
                )
                &&
                (
                    ( point.y >= box.origin_y ) 
                    && 
                    ( (box.origin_y + box.height) >= point.y )
                )
            );
        }
        
/***************************************************
 * CIRCLES
 ***************************************************/
        ,circleCollidesCircle : function(circle1, circle2){
            return this.distanceToPoint(circle1,circle2) < (circle1.radius + circle2.radius);
        }
        ,circleCollidesBox : function(circle, box){
            return Geometry.boxCollidesCircle(box,circle);
        }
        ,circleCollidesLine : function(circle,line, isSegment){
            return Geometry.lineCollidesCircle(line,cricle,isSegment);
        }
        ,circleCollidesPoint : function(circle, point){
            return Geometry.pointCollidesCircle(point, circle);
        }

        
/***************************************************
 * LINES
 ***************************************************/
        // This function returns an array of up to length 2 with points indicating at what points
        // the given circle is intersected by the given line
        ,lineIntersectsCircle : function(line, circle, isSegment){
            var b = line[0];
            var a = line[1];
            
            // Calculate the euclidean distance between a & b
            var eDistAtoB = Math.sqrt( Math.pow(b.x-a.x, 2) + Math.pow(b.y-a.y, 2) );

            // compute the direction vector d from a to b
            var d = { x : (b.x-a.x)/eDistAtoB, y : (b.y-a.y)/eDistAtoB };

            // Now the line equation is x = dx*t + ax, y = dy*t + ay with 0 <= t <= 1.

            // compute the value t of the closest point to the circle center (cx, cy)
            var t = (d.x * (circle.x-a.x)) + (d.y * (circle.y-a.y));

            // compute the coordinates of the point e on line and closest to c
            var e = {
                x : (t * d.x) + a.x,
                y : (t * d.y) + a.y 
            }

            // Calculate the euclidean distance between circle & e
            eDistCtoE = Math.sqrt( Math.pow(e.x-circle.x, 2) + Math.pow(e.y-circle.y, 2) );

            var retVal = [];
            
            // test if the line intersects the circle
            if( eDistCtoE < circle.radius ) {
                // compute distance from t to circle intersection point
                var dt = Math.sqrt( Math.pow(circle.radius, 2) - Math.pow(eDistCtoE, 2));

                // compute first intersection point
                var f = { 
                    x : ((t-dt) * d.x) + a.x,
                    y : ((t-dt) * d.y) + a.y
                };
                
                if(!isSegment || Geometry.lineCollidesPoint(line, f, true)){
                    retVal.push(f);
                }

                // compute second intersection point
                var g = {
                    x : ((t+dt) * d.x) + a.x,
                    y : ((t+dt) * d.y) + a.y
                };
                
                if(!isSegment || Geometry.lineCollidesPoint(line, g, true)){
                    retVal.push(g);
                }
            } else if (parseInt(eDistCtoE) === parseInt(circle.radius)) {
                if(!isSegment || Geometry.lineCollidesPoint(line, e, true)){
                    retVal.push(e);
                }
            } else {
                // do nothing, no intersection
            }
            
            return retVal;
        }
        
        // true IFF a line passes through or tangent to a given circle
        ,lineCollidesCircle : function(line, circle, isSegment){
            var intersects = Geometry.lineIntersectsCircle(line, circle, isSegment);
            return intersects.length > 0 || Geometry.pointCollidesCircle(line[0],circle);
        }
        
        ,lineCollidesPoint : function(line, point, isSegment){
            var angleToPoint1 = Geometry.angleToPoint(line[0],point);
            var angleToPoint2 = Geometry.angleToPoint(line[1],point);
            
            var retVal = angleToPoint1 == angleToPoint2;

            // if the angle is off, we swap the order of two of the points for one of the measurements
            // this simulates the 180 degree check
            if(!retVal){
                angleToPoint2 = Geometry.angleToPoint(point, line[1]);
                retVal = angleToPoint1 == angleToPoint2;
            }

            if(retVal && isSegment){
                retVal = Geometry.distanceToPoint(line[0],point) + Geometry.distanceToPoint(line[1],point) 
                        == Geometry.distanceToPoint(line[0],line[1]);
            }
            
            return retVal;
        }
        
        
/***************************************************
 * POINTS
 ***************************************************/
        ,pointCollidesCircle : function(point, circle){
            return Geometry.distanceToPoint(point,circle) <= circle.radius;
        }
        ,pointCollidesBox : function(point, box){
            return Geometry.boxCollidesPoint(box, point);
        }
        ,pointCollidesPoint : function(point1, point2){
            return ( 
                    ( point1.x == point2.x ) 
                    && 
                    ( point1.y == point2.y ) 
            );
        }
        ,pointCollidesLine : function(point, line){
            return Geometry.lineCollidesPoint(line,point);
        }
        
/***************************************************
 * ANGLES AND DISTANCES
 ***************************************************/
        ,distanceToPoint : function(point1, point2){
            var x = point1.x - point2.x;
            var y = point1.y - point2.y;

            return Math.sqrt( x*x + y*y );
        }
        ,angleToPoint : function(point1, point2, inDegrees){
            var radians = Math.atan2(point2.y - point1.y, point2.x - point1.x);
            return inDegrees ? ( radians * 180 / Math.PI ) : radians;
        }
        /**
         * @param {{x:*. y:*}} point1
         * @param {{x:*. y:*}} point2
         * @returns {Vector}
         */
        ,pointToPoint : function(point1, point2){
            return new TwoCylinder.Engine.Vector({
                speed : Geometry.distanceToPoint(point1,point2),
                direction : Geometry.angleToPoint(point1,point2)
            });
        }
        /**
         * @param {{x:*,y:*}} point1
         * @param {Vector} vector
         * @returns {{x: *, y: *}}
         */
        ,pointFromVector : function(point1, vector){
            return {
                x : point1.x + Math.cos(vector.getDirection()) * vector.getSpeed(),
                y : point1.y + Math.sin(vector.getDirection()) * vector.getSpeed()
            };
        }
        ,getRandomDirection : function(inDegrees) {
            return Math.random() * 2 * Math.PI;
        }
    };
    
    
    return Geometry;
})(); 

/*
    This script contains helper objects and functions that can be used by all classes
*/

TwoCylinder.Engine.Generic = TwoCylinder.Engine.Root.extend({
    initialize : function(options){
        this.setBounding(options.bounding);
    }
    ,collides : function(bounding){
        return this._bounding && this._bounding.collides(bounding);
    }
    ,getBounding : function(){
        return this._bounding;
    }
    ,setBounding : function(b){
        if(!b && ! (b instanceof TwoCylinder.Engine.Bounding)){
            throw "All objects must have a true bounding";
        }
        return this._bounding = b;
    }
});

/*
    This script defines an appearance.
    Appearances are attached to instances and define how that instance should be drawn in the world
*/

TwoCylinder.Engine.Appearance = TwoCylinder.Engine.Generic.extend({
    initialize : function(options){
        this._super('initialize',options);
    }
    
    ,draw : function(canvas,x,y,rotation,scale,entity){
        var context = canvas.getContext('2d');
        context.beginPath();
        context.arc(x, y, 20, 0, 2 * Math.PI, false);
        context.fillStyle = 'grey';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#333333';
        context.stroke();
    }
});
/*
    This script defines a game object
    This is an abstract class that ducktypes what a "game" must be able to do.
    
    
    
    THINGS TO WORK OUT
    - Instance to instance collision checking
    - World backgrounds?
        - Scaling and rotating world backgrounds consistently between views
    - TEST
*/

TwoCylinder.Engine.Game = TwoCylinder.Engine.Generic.extend({
    start : function(){
        return this.getWorld().start();
    }

    ,exit : function(){
        return this.getWorld().exit();
    }
    
    ,setWorld : function(w){
        this.__world = w;
    }
    
    ,getWorld : function(){
        return this.__world;
    }
});
/*
    This script defines a this.__world's view.
    Views are attached to this.__worlds and help determine which instances should be drawn to the this.__canvas and where
*/

TwoCylinder.Engine.View = TwoCylinder.Engine.Generic.extend({
    initialize: function(options){
        this._super('initialize',options);
        this.__canvas = options.canvas;
        
        this._rotation = options.rotation || 0;
        this._scale = options.scale || 1;
        this._resolution = options.resolution || 1;
        
        this.__canvas.width = this.getBounding().width * this._resolution;
        this.__canvas.height = this.getBounding().height * this._resolution;
        this.__canvas.style.width = this.getBounding().width + "px";
        this.__canvas.style.height = this.getBounding().height + "px";
        
        this.__followInstance = false;
        
        this.__ios = [];
        this.__toRemoveIOs = [];
        this.__ioKey = 0;

        // id is set by the world when it's inserted
        this.__id = null;
    }
    ,clearCanvas : function(){
        this.__canvas.getContext('2d').clearRect(0,0,this.__canvas.width,this.__canvas.height);
    }
    ,draw : function(time){
        var i;
        var instances;
        var particles;
        var ios;
        var that = this;

        // before we draw, we want to re-center on our tracked instance if we have one
        if(this.__followInstance){
            this.getBounding().setCenterWithinBounding(
                this.__followInstance.getBounding().getCenter()
                , this.__world.getBounding()
            );
        }
        
        // prepare to draw
        this.clearCanvas();
        
        // first draw the world's background
        this.__world.getBackground().draw(this);
        
        // get all instances and loop through them
        instances = this.__world.getInstances();
        _.each(instances, function(inst){
            // skip invisible instances
            if(!inst.isVisible()){
                return;
            }
            // if this instance's appearance is inside this view box
            // NOTE: we check the appearance's bounding because it may be desirable for the calculated collision box
            // to be different from what is considered visible. for example, if the appearance draws shadows
            // those shadows might not be collidable with other entities, but should be included in
            // determining whether or not to draw the entity to a view.
            if( that.collides( inst.getAppearance().getBounding() ) ){
                //then we draw the instance and pass the view so it can reference the view's
                //transitions and transformation (rotation, scale, etc)
                inst.draw(
                    that
                    ,inst.getBounding().getCenter().x - that.getBounding().getContainingRectangle().origin_x
                    ,inst.getBounding().getCenter().y - that.getBounding().getContainingRectangle().origin_y
                );
            }
        });

        // Draw each particle emitter
        particles = this.__world.getParticleEmitters();
        _.each(particles, function(part){
            if (that.collides(part.getBounding())) {
                part.draw(
                    that,
                    part.getBounding().getCenter().x - that.getBounding().getContainingRectangle().origin_x,
                    part.getBounding().getCenter().y - that.getBounding().getContainingRectangle().origin_y
                )
            }
        });

        // check if any IOs have been removed
        this.__removeIOs();

        //now we loop through the IO handlers for this view
        ios = this.getIOs();
        for(i=0; i<ios.length; i++){
            ios[i].draw();
        }
    }
/****************************************************************************
GETTER AND SETTER FUNCTIONS
****************************************************************************/
    ,getCanvas : function(){
        return this.__canvas;
    }
    ,getWorld : function(){
        return this.__world;
    }
    ,setWorld : function(world){
        this.__world = world;
    }
    ,getRotation : function(){
        return this._rotation;
    }
    ,setRotation : function(r){
        this._rotation = r;
    }
    ,getScale : function(){
        return this._scale;
    }
    ,setScale : function(s){
        this._scale = s;
    }
/****************************************************************************
IO FUNCTIONS
****************************************************************************/    
    ,removeIO : function(io){
        if(io.__id){
            this.__toRemoveIOs.push(io.__id);
        }
        
        return io;
    }
    ,__removeIOs : function() {
        if (!this.__toRemoveIOs.length) {
            return;
        }
        var i;
        var j;
        for(i=0; i<this.__toRemoveIOs.length; i++) {
            for(j=0; j<this.__ios.length; j++){
                if(this.__ios[j].__id == this.__toRemoveIOs[i]){
                    delete this.__ios[j].__id;
                    this.__ios.splice(j,1);
                    break;
                }
            }
        }

        this.__toRemoveIOs = [];
    }
    ,addIO: function(io){
        if(io.__id){
            throw "IO already added";
        }
        io.__id = ++this.__ioKey;

        this.__ios.push(io);
       
        return io;
    }
   
    ,getIOs : function(){
        return this.__ios;
    }
    
    // this gets the mouse position by world, view, and device OR any one of them as an x,y tuple
    ,getMousePosition : function(evt) {
        return new TwoCylinder.IO.Event(evt, this);
    }
    
    ,followInstance : function(instance){
        if(instance){
            this.__followInstance = instance;
        }else{
            this.__followInstance = false;
        }
    }
});
/*
    This script sets up the world canvas.
    Pass options to this object defining things like framerate, dimensions, etc
*/

TwoCylinder.Engine.World = TwoCylinder.Engine.Generic.extend({
    initialize : function(options){
        options.bounding = new TwoCylinder.Engine.BoundingBox({
            origin_x : 0
            ,origin_y : 0
            ,width : options.width
            ,height : options.height
        });
        this._super('initialize',options);
        this._fps = options.fps || 30;
        
        this.__instances = [];
        this.__particleEmitters = [];
        this.__views = [];

        this.__toRemoveParticleEmitters = [];
        this.__toRemoveInstances = [];
        this.__toRemoveViews = [];

        this.__collisionGroups = {};
        this.__background = options.background || new TwoCylinder.Engine.Background();
        
        this.__instanceKey = 0;
        this.__viewKey = 0;
        this.__emitterKey = 0;
        this.__clock = 0;
    }
    
/****************************************************************************
 CONTROLLER FUNCTIONS
 ****************************************************************************/
    //TODO: Needs to somehow sync touch events up with the game clock
    ,start : function(){
        var that = this;
        this.__intervalId = setInterval(function(){
            try{
                that.loop.apply(that,[]);
            } catch (e) {
                that.exit(e);
            }
        }, 1000 / this._fps);
    }
    
    ,__preStep : function(time){
        // we have each instance perform a frame step.
        _.each(this.__instances, function(inst){
            inst.preStep(time);
        });
    }
    
    ,__postStep : function(time){
        // we have each instance perform a frame step.
        _.each(this.__instances, function(inst){
            inst.postStep(time);
        });

        this.__removeParticleEmitters();
        this.__removeViews();
        this.__removeInstances();
    }
    
    ,loop : function(){
        this.__preStep(++this.__clock);
        var that = this;

        // we have each instance perform a frame step.
        _.each(this.__particleEmitters, function(part) {
            part.step(that.__clock);
        });

        // we have each instance perform a frame step.
        _.each(this.__instances, function(inst) {
            inst.step(that.__clock);
        });

        // check for collisions
        _.each(this.__instances, function(me) {
            if (me.hasCollisionChecking()) {
                var myCollisionGroups = me.getCollidableGroups();
                _.each(myCollisionGroups, function(group){
                    // if there are instances that match the groups im listening for
                    if (that.__collisionGroups[group] && that.__collisionGroups[group].length) {

                        // for each of those matching instance types,
                        _.each(that.__collisionGroups[group], function(other){

                            // if they're not me, and I collide with them
                            if (me.__id != other.__id && me.collides(other.getBounding())) {
                                me.handleCollidedWith(other);
                            }
                        });
                    }
                });
            }
        });

        // draw the views
        _.each(this.__views, function(view){
            view.draw(that.__clock);
        });

        this.__postStep(this.__clock);
    }
    
    ,exit : function(){
        clearInterval(this.__intervalId);
        
        //TODO: handle exit
    }
    
/****************************************************************************
 INSTANCE FUNCTIONS
 ****************************************************************************/    
    ,removeInstance : function(instance){
        if(instance.__id){
            // we add their id to the array of instances to remove
            this.__toRemoveInstances.push(instance.__id);
        }
        return instance;
    }
    ,__removeInstances : function() {
        if (!this.__toRemoveInstances.length) {
            return;
        }
        var i;
        var j;
        for (i=0; i<this.__toRemoveInstances.length; i++) {
            for(j=0; j<this.__instances.length; j++){
                if(this.__instances[j].__id == this.__toRemoveInstances[i]){
                    this.__removeFromCollisionGroup(this.__instances[j]);
                    delete this.__instances[j].__id;
                    this.__instances.splice(j,1);
                    break;
                }
            }
        }

        this.__toRemoveInstances = [];
    }
    
    ,addInstance : function(instance){
        if(instance.__id){
            throw "Instance already added";
        }
        instance.__id = ++this.__instanceKey;
        // add it to the big list
        this.__instances.push(instance);
        // also add it according to its collision group
        this.__addToCollisionGroup(instance);
        
        return instance;
    }
    
    ,getInstances : function(){
        return this.__instances;
    }
    
/****************************************************************************
 VIEW FUNCTIONS
 ****************************************************************************/
    ,addView : function(view){
        if (view.__id) {
            throw "View already added";
        }
        view.__id = ++this.__viewKey;
        view.setWorld(this);
        this.__views.push(view);
        
        return view;
    }
    
    ,getViews : function(){
        return this.__views;
    }

    ,__removeViews : function() {
        if (!this.__toRemoveViews.length) {
            return;
        }
        var i;
        var j;
        for (i=0; i<this.__toRemoveViews.length; i++) {
            for(j=0; j<this.__views.length; j++){
                if(this.__views[j].__id == this.__toRemoveViews[i]){
                    delete this.__views[j].__id;
                    this.__views.splice(j,1);
                    break;
                }
            }
        }

        this.__toRemoveViews = [];
    }
    
    ,removeView : function(view){
        if(view.__id) {
            // we add their id to the array of views to remove
            this.__toRemoveViews.push(view.__id);
        }
        return view;
    }
    
/****************************************************************************
PARTICLE FUNCTIONS
****************************************************************************/
    ,addParticleEmitter : function(emitter){
        if (emitter.__id){
            throw "Emitter already added";
        }
        emitter.__id = ++this.__emitterKey;
        this.__particleEmitters.push(emitter);
        return emitter;
    }

    ,removeParticleEmitter : function(emitter){
        if (emitter.__id) {
            // we add their id to the array of emitters to remove
            this.__toRemoveParticleEmitters.push(emitter.__id);
        }
        return emitter;
    }
    ,__removeParticleEmitters : function(){
        if (!this.__toRemoveParticleEmitters.length) {
            return;
        }
        var i;
        var j;
        for(i=0; i<this.__toRemoveParticleEmitters.length; i++) {
            for(j=0; j<this.__particleEmitters.length; j++){
                if(this.__particleEmitters[j].__id == this.__toRemoveParticleEmitters[i]){
                    delete this.__particleEmitters[j].__id;
                    this.__particleEmitters.splice(j,1);
                    break;
                }
            }
        }

        this.__toRemoveParticleEmitters = [];
    }
    ,getParticleEmitters : function() {
        return this.__particleEmitters;
    }
/****************************************************************************
BACKGROUND FUNCTIONS
****************************************************************************/
    ,setBackground : function(background){
        this.__background = background;
    }
    
    ,getBackground : function(){
        return this.__background;
    }
/****************************************************************************
HELPER FUNCTIONS
****************************************************************************/
    ,__addToCollisionGroup : function(instance){
        var group = instance.getCollisionGroup();

        if(!this.__collisionGroups[group]){
            this.__collisionGroups[group] = [];
        }
        this.__collisionGroups[group].push(instance);
    }
    ,__removeFromCollisionGroup : function(instance){
        var i;
        var group = instance.getCollisionGroup();

        for(i=0; i<this.__collisionGroups[group].length; i++){
            if(this.__collisionGroups[group][i].__id == instance.__id){
                this.__collisionGroups[group].splice(i,1);
                break;
            }
        }
    }
});
/*
    Backgrounds are objects that control how the game background should appear. 
    At most, there should be one per world. 
*/

TwoCylinder.Engine.Background = TwoCylinder.Engine.Root.extend({
    initialize : function(options){
        options = _.extend({
            color : 'transparent'
        },options);
        this._color = options.color;
    }
    ,draw : function(view){
        var canvas = view.getCanvas();
        var containingRectangle = view.getBounding().getContainingRectangle();
        var context = canvas.getContext('2d');
        context.beginPath();
        context.fillStyle = this._color;
        context.fillRect(0,0,containingRectangle.width,containingRectangle.height);
        context.fill();
        context.stroke();
    }
});

/*
 This script defines the Vector object
 */

TwoCylinder.Engine.Vector = TwoCylinder.Engine.Root.extend({
    initialize : function(options) {
        options = _.extend({
            direction : 0,
            speed : 0
        },options);

        this.__direction = options.direction;
        this.__speed = options.speed;
    }
// ------------------------------------
// GETTERS / SETTERS
// ------------------------------------
    ,getDirection : function(){
        return this.__direction;
    }
    ,getSpeed : function(){
        return this.__speed;
    }
    ,setDirection : function(dir){
        this.__direction = dir;
    }
    ,setSpeed : function (speed) {
        this.__speed = speed;
    }
// ------------------------------------
// CONVENIENCE FUNCTIONS
// ------------------------------------
    ,rotateTowards : function(dir, friction){
        var currentDirection = this.getDirection();
        var TAU = ( 2 * Math.PI );
        var directionDiff = (dir + TAU - currentDirection) % TAU;

        friction = friction ? friction : 1;
        if (directionDiff <= (Math.PI) ){
            this.setDirection(currentDirection + (directionDiff / friction));
        }else{
            this.setDirection(currentDirection - ( ( directionDiff - Math.PI ) / friction));
        }
    }
});

/*
    Profiles are used to remove the ambiguity with determining bounding box
*/

TwoCylinder.Engine.Bounding = TwoCylinder.Engine.Root.extend({
    initialize : function(options){
        this._properties = [];
        this.rotation = 0;
        
        var that = this;
        _.each(options, function(v,k){
            that._properties.push(k);
        });
        
        this.updateBounding(options);
    }
    ,getCenter : function(){
        return { x : null, y : null };
    }
    ,setCenter : function(tuple){
        return null;
    }
    ,setCenterWithinContainer : function(tuple,bounding){
        // if not implemented, just set the center normal style
        return this.setCenter(tuple);
    }
    ,getContainingRectangle : function(){
        return { origin_x : null, origin_y : null, width : null, height : null};
    }
    ,getRotation : function(){
        return null;
    }
    ,setRotation : function(r){
        this.rotation = r;
    }
    ,updateBounding : function(key, value){
        if(typeof(key) == 'object'){
            var that = this;
            _.each(key, function(v, k){
                if(~_.indexOf(that._properties,k)){
                    that[k] = v; 
                }
            });
        }else{
            if(~_.indexOf(this._properties,key)){
                this[key] = value; 
            }
        }
        return this;
    }
    ,collides : function(bounding){
        return false;
    }
});

// RectangleProfiles need an origin x,y and a width and height
TwoCylinder.Engine.BoundingBox = TwoCylinder.Engine.Bounding.extend({
    getCenter : function(){
        return {
            x : this.origin_x + (this.width / 2)
            , y : this.origin_y + (this.height / 2)
        };
    }
    ,setCenter : function(tuple){
        this.origin_x = tuple.x - (this.width / 2);
        this.origin_y = tuple.y - (this.height / 2);
    }
    // TODO: This won't work properly with circles... Perhaps move it to the Geometry function and treat it like collisions
    ,setCenterWithinBounding : function(tuple, bounding){
        var containingBox = bounding.getContainingRectangle();
        var myBox = this.getContainingRectangle();
        
        
        var targetX = tuple.x;
        var targeyY = tuple.y;
        
        if(containingBox.width < myBox.width){
            targetX = bounding.getCenter().x;
        }else{
            // to center within we take the min between x and the containingbox edge - 1/2 my width
            targetX = Math.min(tuple.x, containingBox.origin_x + containingBox.width - (myBox.width/2) );
            // then max it with the same on the other end
            targetX = Math.max(targetX, containingBox.origin_x + (myBox.width/2));
            // this ensures, when centered, our left and right edges do not cross the containingBox borders 
        }
        
        // Then, do it again for height
        
        if(containingBox.height < myBox.height){
            targetY = bounding.getCenter().y;
        }else{
            // to center within we take the min between x and the containingbox edge - 1/2 my width
            targetY = Math.min(tuple.y, containingBox.origin_y + containingBox.height - (myBox.height/2) );
            // then max it with the same on the other end
            targetY = Math.max(targetY, containingBox.origin_y + (myBox.height/2));
            // this ensures, when centered, our left and right edges do not cross the containingBox borders
        }
        
        this.setCenter({ x : targetX , y : targetY });
    }
    ,getContainingRectangle : function(){
        return {
            origin_x : this.origin_x
            ,origin_y : this.origin_y
            ,width : this.width
            ,height : this.height
        };
    }
    ,collides : function(bounding){
        if(bounding instanceof TwoCylinder.Engine.BoundingBox){
            return TwoCylinder.Engine.Geometry.boxCollidesBox(this,bounding)
        }else if(bounding instanceof TwoCylinder.Engine.BoundingCircle){
            return TwoCylinder.Engine.Geometry.boxCollidesCircle(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.BoundingPoint){
            return TwoCylinder.Engine.Geometry.boxCollidesPoint(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.Bounding){ 
            // if it's not a rectangle, circle, or point, it could be a new type of bounding
            // in which case we let it handle the collision checking
            return bounding.collides(this);
        }else{ // treat bounding like a tuple
            return TwoCylinder.Engine.Geometry.boxCollidesPoint(this, bounding);
        }
    }
});

// CircleProfiles need a center point and a radius
TwoCylinder.Engine.BoundingCircle = TwoCylinder.Engine.Bounding.extend({
    getCenter : function(){
        return { x : this.x, y : this.y };
    }
    ,setCenter : function(tuple){
        this.x = tuple.x;
        this.y = tuple.y;
    }
    ,getContainingRectangle : function(){
        return{
            origin_x : this.x - radius
            ,origin_y : this.y - radiuis
            ,width : 2 * this.radius
            ,height : 2 * this.radius
        };
    }
    ,collides : function(bounding){
        if(bounding instanceof TwoCylinder.Engine.BoundingBox){
            return TwoCylinder.Engine.Geometry.circleCollidesBox(this,bounding)
        }else if(bounding instanceof TwoCylinder.Engine.BoundingCircle){
            return TwoCylinder.Engine.Geometry.circleCollidesCircle(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.BoundingPoint){
            return TwoCylinder.Engine.Geometry.circleCollidesPoint(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.Bounding){ 
            // if it's not a rectangle, circle, or point, it could be a new type of bounding
            // in which case we let it handle the collision checking
            return bounding.collides(this);
        }else{ // treat bounding like a tuple
            return TwoCylinder.Engine.Geometry.circleCollidesPoint(this, bounding);
        }
    }
});

// CircleProfiles need a center point and a radius
TwoCylinder.Engine.BoundingPoint = TwoCylinder.Engine.Bounding.extend({
    getCenter : function(){
        return { x : this.x, y : this.y };
    }
    ,setCenter : function(tuple){
        this.x = tuple.x;
        this.y = tuple.y;
    }
    ,getContainingRectangle : function(){
        return{
            origin_x : this.x
            ,origin_y : this.y
            ,width : 0
            ,height : 0
        };
    }
    ,collides : function(bounding){
        if(bounding instanceof TwoCylinder.Engine.BoundingBox){
            return TwoCylinder.Engine.Geometry.pointCollidesBox(this,bounding)
        }else if(bounding instanceof TwoCylinder.Enginer.BoudingCircle){
            return TwoCylinder.Engine.Geometry.pointCollidesCircle(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.BoundingPoint){
            return TwoCylinder.Engine.Geometry.pointCollidesPoint(this,bounding);
        }else if(bounding instanceof TwoCylinder.Engine.Bounding){ 
            // if it's not a rectangle, circle, or point, it could be a new type of bounding
            // in which case we let it handle the collision checking
            return bounding.collides(this);
        }else{ // treat bounding like a tuple
            return TwoCylinder.Engine.Geometry.circleCollidesPoint(this, bounding);
        }
    }
});

/*
    This script defines a single generic object that can be inserted into the world
*/

TwoCylinder.Engine.Entity = TwoCylinder.Engine.Generic.extend({
    initialize:function(options){
        this._super('initialize',options);
        
        // -------------------------------
        this.__appearance = null;
        
        options = _.extend({
            velocity : null // Vector :: the instance's velocity vector
            ,rotation : 0 // float :: the instance's this.__appearance rotation
            ,rotation_lag : 20 // int :: the number of steps it will take to turnTowards a target direction
        },options);
        
        if(options.appearance){
            this.setAppearance(options.appearance);
        }
        
        this._velocity = options.velocity;
        this._rotationLag = options.rotation_lag;
        this._rotation = options.rotation;
        this._collisionGroup = 'ENTITY';
        
        // -------------------------------
        
        // id is set by the world when it's inserted
        this.__id = null;
        this.__collisionGroupListening = {};
        
        this.__visible = true;           // boolean  :: is this instance visible
    }
    
    // draw is called by a view.
    // the view passes a callback function which is called IFF this instance is to be drawn
    // passed to that function is important information that will be forwarded to the Instance's this.__appearance
    ,draw : function(view, center_x, center_y){
        this.getAppearance().draw(
                view.getCanvas(), 
                center_x, 
                center_y, 
                view.getRotation() * this._rotation, 
                view.getScale(), 
                this
        );
    }
    ,preStep: function(worldClock){
        return;
    }
    ,step : function(worldClock){
        if(this.getSpeed()){
            this.getBounding().setCenter({
                x : this.getBounding().getCenter().x + this.getSpeed() * Math.cos(this.getDirection())
                ,y : this.getBounding().getCenter().y + this.getSpeed() * Math.sin(this.getDirection())
            });
            
            if(this.getAppearance()){
                this.getAppearance().getBounding().setCenter(this.getBounding().getCenter());
            }
        }
    }
    ,postStep: function(worldClock){
        return;
    }
/****************************************************************************
COLLISIONS AND COLLISION CHECKING
****************************************************************************/
    
    // this will return what collision group this entity belongs to
    ,getCollisionGroup : function(){
        return this._collisionGroup
    }
    
    ,getCollidableGroups : function(){
        return Object.keys(this.__collisionGroupListening);
    }
    
    // this function passes an other instance and signifies a collision has occurred
    // this instance then determines if it should react to the collision or not
    ,handleCollidedWith : function(other){
        var collisionFunction = this.objectIsCollidable(other);
        if(collisionFunction){
            collisionFunction.apply(this,[other]);
        }
    }
    
    ,groupIsCollidable : function(group){
        retVal = false;
        if(this.__collisionGroupListening[other]){
            retVal = this.__collisionGroupListening[other];
        }
        return retVal;
    }
    
    // this function will return the collision function for a passed Entity instance
    // or false IFF there is no corresponding collision function
    ,objectIsCollidable : function(other){
        var retVal = false;
        
        if(other instanceof TwoCylinder.Engine.Entity){
            _.each(this.__collisionGroupListening, function(collisionFunction,key){
                if(other.getCollisionGroup() == key){
                    retVal = collisionFunction;
                    return false;
                }
            });
        }
        
        return retVal;
    }
    
    // this will return true IFF this object is listening for collisions
    ,hasCollisionChecking : function(){
        return !_.isEmpty(this.__collisionGroupListening);
    }
    
    // ----------------------
    
    // this collision function handles collisions between this instance and instances of a specified Group
    ,onCollideGroup : function(group, callback){
        this.__collisionGroupListening[group] = callback;
    }
    
    ,offCollideGroup : function(group){
        delete this.__collisionGroupListening[group];
    }
    
/****************************************************************************
 GETERS AND SETTERS
 ****************************************************************************/
    
    ,getPosition : function(){
        return this.getBounding().getCenter();
    }
    
    /**
     * tuple can either be a boundingPoint, tuple (x & y) or just x (in which case y is y)
     */
    ,setPosition : function(tuple, y){
        if(tuple instanceof TwoCylinder.Engine.BoundingPoint){
            this.getBounding().updateBounding(tuple.getCenter());
        }else if(typeof(tuple) == 'object'){
            this.getBounding().updateBounding({x:tuple.x,y:tuple.y});
        }else{
            this.getBounding().updateBounding(tuple,y);
        }
    }
    
    // ----------------------
    
    /**
     * app is an Appearance object
     * when setting an this.__appearance object, you can also change the collision box by passing new collision dimensions
     * "box" can either be a tuple (width & height) or just width in which case h is height
     */
    ,setAppearance : function(app, h){
        this.__appearance = app;
    }
    
    // This function defines how to draw this instance
    ,getAppearance : function(){
        return this.__appearance; 
    }
    
    // ----------------------
    
    ,getDirection : function(){
        return this.getVelocity().getDirection();
    }
    ,rotateTowards : function(dir){
        this.getVelocity().rotateTowards(dir, this._rotationLag);
    }
    ,setDirection : function(dir){
        this.getVelocity().setDirection(dir);
        
        return this.getDirection();
    }

    ,getSpeed : function(){
        return this.getVelocity().getSpeed();
    }

    ,setSpeed : function(speed){
        this.getVelocity().setSpeed(speed);
    }

    ,setVelocity : function(velocity) {
        this._velocity = velocity;
    }
    ,getVelocity : function() {
        if (!this._velocity) {
            this._velocity = new TwoCylinder.Engine.Vector();
        }
        return this._velocity;
    }
    
    // ----------------------
    
    ,getVisible : function(){
        return this.isVisible();
    }
    
    ,isVisible : function(){
        // must be in the world, visible, and with an appearance
        return this.__id && this.__visible && !!this.__appearance;
    }
    
    ,setVisible : function(vis){
        this.__visible =  vis;
    }
});
/*
    This script defines a single generic object that can be inserted into the world
*/

TwoCylinder.Engine.ParticleEmitter = TwoCylinder.Engine.Generic.extend({
    initialize:function(options){
        this._super('initialize',options);

        // -------------------------------
        this.__particles = [];
        this.__toRemove = [];

        // by default, newly created emitters do not emit until told to
        this.__isEmitting = false;

        // an internal id counter
        this.__particleKey = 0;

        // id is set by the world when it's inserted
        this.__id = null;
    }
    // an emitter drawing basically just calls draw on all its particles
    // particles are like appearances, but without bounding boxes - they just get drawn if the emitter is in
    // collision with the view
    ,draw : function(view, center_x, center_y){
        _.each(this.getParticles(), function(p){
            p.draw(view.getCanvas(),
                center_x,
                center_y,
                view.getRotation() * this._rotation,
                view.getScale(),
                this);
        });
    }
    ,step : function(clock) {
        _.each(this.getParticles(), function(p) {
            p.step(clock);
        });

        this.__removeParticles();
    }
    ,destroy : function() {
        this.__particles = [];
    }
    ,setIsEmitting: function(isEmitting) {
        this.__isEmitting = isEmitting;
    }
    ,getIsEmitting: function() {
        return this.__isEmitting;
    }

/****************************************************************************
 PARTICLES
 ****************************************************************************/
    ,getParticles : function() {
        return this.__particles;
    }
    ,removeParticle : function(particle) {
        this.__toRemove.push(particle);
    }

    ,__removeParticles : function(particle) {
        if (!this.__toRemove.length) {
            return
        }

        var i;
        var j;
        for(i=0; i<this.__toRemove.length; i++) {
            for(j=0; j<this.__particles.length; j++){
                if(this.__particles[j].__id == this.__toRemove[i]){
                    delete this.__particles[j].__id;
                    this.__particles.splice(j,1);
                    break;
                }
            }
        }

        this.__toRemove = [];
    }
    /**
     * It may be advantageous for particle emitters to emit particles one at a time
     * rather than repeatedly. In that case, this function can be used
     * @param {function} particleType
     */
    ,emitParticle: function(particleType, options) {
        var newParticle;
        var defaultOptions = {
            id : ++this.__particleKey,
            emitter : this
        };

        options = options ? _.extend(options,defaultOptions) : defaultOptions;
        newParticle = new particleType(options);
        this.__particles.push(newParticle);

        return newParticle;
    }
});
/*
 This script defines the particle object
 */

TwoCylinder.Engine.Particle = TwoCylinder.Engine.Root.extend({
    initialize : function(options) {
        options = _.extend({}, options);
        this.__id = options.id;
        this.__emitter = options.emitter;
    }
    // This function is responsible for moving the particle or otherwise tracking its lifecycle
    ,step : function(clock) {
        return null;
    }
    ,draw : function(canvas,x,y,rotation,scale,emitter){
        var context = canvas.getContext('2d');
        context.beginPath();
        context.arc(x, y, 20, 0, 2 * Math.PI, false);
        context.fillStyle = 'grey';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#333333';
        context.stroke();
    }
    ,destroy : function() {
        this.__emitter.removeParticle(this);
    }
});

TwoCylinder.IO.EVENT_TYPES = {};
TwoCylinder.IO.EVENT_TYPES.TAP = 'tap';
TwoCylinder.IO.EVENT_TYPES.DOUBLE = 'doubletap';
TwoCylinder.IO.EVENT_TYPES.LONG = 'longtap';
TwoCylinder.IO.EVENT_TYPES.MOVE = 'mousemove';
TwoCylinder.IO.EVENT_TYPES.UP = 'mouseup';
TwoCylinder.IO.EVENT_TYPES.DOWN = 'mousedown';

/*
    This script creates a basic user interface
*/

TwoCylinder.IO.Event = TwoCylinder.Engine.BoundingPoint.extend({
    initialize : function(evt, view){
        // -----------------------------------------------------
        // This part was taken from Stack Overflow
        // http://stackoverflow.com/questions/8389156
        var el = evt.target,
            x = 0,
            y = 0;

        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        // -----------------------------------------------------
        
        this._super('initialize',{
            x : evt.clientX - x
            ,y : evt.clientY - y
        });
        
        if(view){
            this.world_x = this.x + view.getBounding().origin_x;
            this.world_y = this.y + view.getBounding().origin_y;
            var rect = view.getCanvas().getBoundingClientRect();
            this.device_x = this.x + rect.left;
            this.device_y = this.y + rect.top;
        }
        
        this.timestamp = Date.now();
    }
    ,linkEvent : function(evt){
        // we want them to only link events
        if(evt instanceof TwoCylinder.IO.Event){
            this.linked_event = evt; 
            this.velocity = TwoCylinder.Engine.Geometry.pointToPoint(this.linked_event, this);
        }
        
        return this;
    }
    ,setType : function(eventType){
        if( _.indexOf(_.values(TwoCylinder.IO.EVENT_TYPES), eventType) !== -1){
            this.type = eventType;
            return this;
        }else{
            return false;
        }
    }
    ,getType : function(){
        if(this.type){
            return this.type;
        }else{
            return null;
        }
    }
});

/*
    This script creates a basic user interface
*/
TwoCylinder.IO.Touch = TwoCylinder.Engine.Generic.extend({
    initialize : function(options){
        this.__view = options.view;
        
        //by default the touch location is the full canvas
        options = _.extend({
            bounding : this.__view.getBounding()
            ,double : 300
            ,tap : 300
            ,tap_distance : 20
        }, options);
        
        this.setBounding(options.bounding);
        
        this._doubleTapThreshold = options.double;
        this._tapThreshold = options.tap;
        this._tapDistanceThreshold = options.tap_distance;
        this._longTapCancel = 2 * this._tapThreshold;
        
        // absolute touch boxes are bound to the world which means the calculate touching
        // via worldy coordinate systems as opposed to the view's relative coordinates [default]
        if(options.absolute){
            this.__boundToWorld = true
        }
        
        // these events store the last events -- TODO : Maybe make them arrays? Store the trailing events?
        this._lastUp = null;
        this._lastDown = null;
        this._lastMove = null;
        
        var that = this;
        // create a listener for each type of event
        _.each(TwoCylinder.IO.EVENT_TYPES,function(val){
            that.__getListenersByType.call(that,val);
        });
        
        // id is set by the view when the touch object is inserted
        this.__id = null;

        // key is used to track touch listeners
        this.__key = 0;
        
        // used to check if the touch is currently down
        this.__isDown = false;
        
        // What follows are the browser event binding calls
        this.__view.getCanvas().addEventListener('mousedown',function(evt){
            that._handleDown.apply(that,arguments);
        },false);
        this.__view.getCanvas().addEventListener('touchstart',function(evt){
            evt.preventDefault();
            that._handleDown.apply(that,arguments);
        },false);
        
        this.__view.getCanvas().addEventListener('mouseup',function(evt){
            that._handleUp.apply(that,arguments);
        },false);
        this.__view.getCanvas().addEventListener('touchend',function(evt){
            evt.preventDefault();
            that._handleUp.apply(that,arguments);
        },false);
        
        this.__view.getCanvas().addEventListener('mousemove',function(evt){
            that._handleMove.apply(that,arguments);
        },false);
        this.__view.getCanvas().addEventListener('touchmove',function(evt){
            evt.preventDefault();
            that._handleMove.apply(that,arguments);
        },false);
    }
    /*
     * If this touch has an appearance, we draw it
     */
    ,draw : function(){
        if(this.getAppearance()){
            this.getAppearance().draw(
                this.__view.getCanvas(), 
                this.getBounding().getCenter().x,
                this.getBounding().getCenter().y, 
                this.__view.getRotation(),
                this.__view.getScale(),
                this
            );
        }
    }
    /*
     * Appearance will be important for extended objects wishing to give the touch zones a visual represenation
     */
    ,setAppearance : function(app){
        this.__appearance = app;
    }
    
    ,getAppearance : function(app){
        return this.__appearance;
    }
    
    /*
     * These function receive a browser event and determin whether or not
     * to fire an IO event to listeners based on collision type, location, and touch state
     * They are also responsible with properly formatting the IO event (determining if it's
     * a single tap, double tap, move, etc...)
     */
    ,_handleDown : function(evt){
        var event = this.__formatTouchEvent(evt);
        if(!event){
            return;
        }
        event.setType(TwoCylinder.IO.EVENT_TYPES.DOWN);

        this.__isDown = true;
        this.__lastDown = event;
        this.__fireEvent(event);
    }
    ,_handleUp : function(evt){
        var event = this.__formatTouchEvent(evt);
        if(!event){
            return;
        }
        
        if(!this.isDown()){
            return;
        }
        
        // found is used to determine if we've already assigned a type to this event before checking for others
        // it's really just a helper variable so we can avoid deeply nested if / else ifs
        var found = false;
        
        // first we check for DOUBLE tap
        if( this.__lastUp 
            && this.__lastUp.type == TwoCylinder.IO.EVENT_TYPES.TAP 
            && (this.__lastUp.timestamp - event.timestamp) <= this._doubleTapThreshold
        ){
            event.setType(TwoCylinder.IO.EVENT_TYPES.DOUBLE);
            found = true;
        }
        
        // next we check for LONG tap
        if(!found && this.__lastDown && (TwoCylinder.Engine.Geometry.distanceToPoint(this.__lastDown, event) < this._tapDistanceThreshold)){
            var lastDownDiff = event.timestamp - this.__lastDown.timestamp;
            if(lastDownDiff <= this._tapThreshold){
                event.setType(TwoCylinder.IO.EVENT_TYPES.TAP);
                found = true;
            }else if(lastDownDiff <= this._longTapCancel){
                event.setType(TwoCylinder.IO.EVENT_TYPES.LONG);
                found = true;
            }else{
                // do nothing, we're cancelling the long click
            }
        }
        
        // at this point, it must be the end of a move, so we give it a default
        if(!found){
            event.setType(TwoCylinder.IO.EVENT_TYPES.UP);
        }
        
        event.linkEvent(this.__lastDown);
        this.__lastUp = event;
        this.__fireEvent(event);
        this.__isDown = false;
    }
    ,_handleMove : function(evt){
        if( !this.isDown()){
            return;
        }
        
        var event = this.__formatTouchEvent(evt);
        if(!event){
            return;
        }
        
        if( 
            ( (event.timestamp - this.__lastDown.timestamp) <= this._longTapCancel)
            &&
            (TwoCylinder.Engine.Geometry.distanceToPoint(this.__lastDown, event) < this._tapDistanceThreshold)
        ){
            // if they haven't moved their finger enough and we're within the longtap threshold
            return;
        }
            
        event.setType(TwoCylinder.IO.EVENT_TYPES.MOVE);
        event.linkEvent(this.__lastMove);
        this.__lastMove = event;
        this.__fireEvent(event);
        
    }
    /*
     * This function takes an IO Event and fires it to all bound listeners of its type
     */
    ,__fireEvent : function(event){
        var handlers = this.__getListenersByType(event.getType());
        if(handlers.length){
            for(var i=0; i<handlers.length; i++){
                handlers[i].callback(event);
            }
        }
    }
    /*
     * This function will be used to queue previous events to  store a history rather than just
     * the last one (lastMove, lastUp, lastDown)
     */
    ,__queueHistory : function(group,event){
        group[0] = group[0].toUpperCase();
        this['__last'+group].push(event);
        this['__last'+group].shift();
        return null;
    }
    
    /*
     * This function might be uneeded? It basically adds all listeners to an array so we can
     * potentially more easily track them (by key)
     */
    ,__formatListener : function(callback){
        return {
            key : ++this.__key
            ,callback : callback
        }
    }
    /*
     * This function takes a browser event (mouse or touch) and converts it into a TwoCylinder IO event
     * IFF it registered a collision with this touch space else it returns false 
     */ 
    ,__formatTouchEvent : function(evt){
        //TODO: I'm not sure if this.collides will work for views that are not origin_x = 0, origin_y = 0
        // BECAUSE, I think the event's x and y is relative to the device and the touch instance is relative
        // to the world view (I THINK)
        
        // changed Touches is used for multitouch... ?
        // https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches
        
        var touches = evt.changedTouches ? evt.changedTouches : touches;
        
        if(touches && touches.length){
            var event = false;
            var step = 0;
            
            do{
                if(step < touches.length){
                    evt.clientX = touches[step].clientX;
                    evt.clientY = touches[step].clientY;
                }else{
                    return false;
                }
                event = new TwoCylinder.IO.Event(evt,this.__view);
                step++;
            }while(!this.collides(event));
        }else{
            event = new TwoCylinder.IO.Event(evt,this.__view);
            if(!this.collides(event)){
                return false;
            }
        }
                
        return event;
    }
    /*
     * This function returns all bound listeners based on type
     */
    ,__getListenersByType : function(type){
        if(!type){
            return null;
        }
        if(!_.has(this, '__'+type+'Listeners')){
            this['__'+type+'Listeners'] = [];
        }
        return this['__'+type+'Listeners'];
    }
    
    /*
     * This function is used to bind a handler to a certain type of IO event
     */
    ,__on : function(type,callback){
        var array = this.__getListenersByType(type);
        array.push(this.__formatListener(callback));
    }
    /*
     * This function removes a passed binding
     */
    ,__off : function(type,callback){
        var array = this.__getListenersByType(type);
        for(var i=0; i<array.length; i++){
            if(array[i].callback === callback){
                delete array[i];
            }
        }
    }
    
    /*
     * The following are helper functions to make calling __on and __off more semantic
     */
    ,onDouble : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.DOUBLE,callback);
    }
    ,offDouble : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.DOUBLE,callback);
    }
    ,onLong : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.LONG,callback);
    }
    ,offLong : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.LONG,callback);
    }
    
    ,onTap : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.TAP,callback);
    }
    ,offTap : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.TAP,callback);
    }
    
    ,onDown : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.DOWN,callback);
    }
    ,offDown : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.DOWN,callback);
    }
    
    ,onMove : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.MOVE,callback);
    }
    ,offMove : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.MOVE,callback);
    }
    
    ,onUp : function(callback){
        this.__on(TwoCylinder.IO.EVENT_TYPES.UP,callback);
    }
    ,offUp : function(callback){
        this.__off(TwoCylinder.IO.EVENT_TYPES.UP,callback);
    }
    
    /*
     * This function can determine if this touch instance is being actively engaged
     */
    ,isDown : function(){
        return this.__isDown;
    }
});

/*
    This script handles drawing the joystick appearance
*/
TwoCylinder.IO.Joystick = TwoCylinder.IO.Touch.extend({
    initialize : function(options){
        this._defaultRadius = 40;
        options.tap_distance = 0;
        options.bounding = new TwoCylinder.Engine.BoundingCircle({
            x : options.x
            ,y : options.y
            ,radius : this._defaultRadius
        });
        this._super('initialize',options);
        
        this.__isHeld = false;
        
        this.__pullRatio = 1.8;
        
        // the operate function is what we will pass joystick motions to
        this.__operateFunction = null;
        
        this.__appearance = new TwoCylinder.Sprites.Joystick();
        
        var that = this;
        
        this._previousEvent = null;
        
        this.onDown(function(evt){
            that._previousEvent = evt; //initialize evt
            
            // we link to itself so that the joystick draws properly
            that._previousEvent.linkEvent(evt);
            
            that.getBounding().updateBounding({
                radius : 4 * that._defaultRadius
            });
            
            if(typeof(that.__operateFunction) == 'function'){
                if (evt.velocity) {
                    evt.velocity.setSpeed(0);
                }
                that.__operateFunction(evt);
            }
        });
        
        this.onUp(function(evt){
            that.getBounding().updateBounding({
                radius : that._defaultRadius
            });
            delete that._previousEvent;
            
            if(typeof(that.__operateFunction) == 'function'){
                if (evt.velocity) {
                    evt.velocity.setSpeed(0);
                }
                that.__operateFunction(evt);
            }
        });
        
        this.onMove(function(evt){
            if(that.isDown()){
                evt.linkEvent(that.__lastDown);
                if(typeof(that.__operateFunction) == 'function'){
                    //want to make the max speed the distance we allow the joystick to move
                    if (evt.velocity) {
                        evt.velocity.setSpeed(Math.min(evt.velocity.getSpeed(), that._defaultRadius / that.__pullRatio));
                    }
                    that.__operateFunction(evt);
                }
                that._previousEvent = evt;
            }
        });
    }
    ,onOperate : function(callback){
        this.__operateFunction = callback;
    }
    ,offOperate : function(){
        delete this.__operateFunction; 
    }
    ,getDrawOptions : function(){
        var options = {
            stick : this.getBounding().getCenter()
            ,operating : this.isDown()
        };
        
        if(this._previousEvent && this._previousEvent.velocity){
            var vector = _.clone(this._previousEvent.velocity);
            vector.setSpeed(Math.min(this._defaultRadius / this.__pullRatio, this._previousEvent.velocity.getSpeed()));
            options.stick = TwoCylinder.Engine.Geometry.pointFromVector(options.stick, vector);
        }
        
        return options;
    }
}); 
/*
    This script handles drawing the joystick appearance
*/
TwoCylinder.Sprites.Joystick = TwoCylinder.Engine.Appearance.extend({
    initialize : function(){
        options = {
            bounding : new TwoCylinder.Engine.BoundingCircle({
                x : 0
                ,y : 0
                ,radius : 20
            })
        };
        
        this._super('initialize',options);
        
    }
    ,draw : function(canvas,x,y,rotation,scale,joystick){
        var options = joystick.getDrawOptions();
        var context = canvas.getContext('2d');
        
        // if the joystick is being operated, we draw the binding circle
        if(options.operating){
            context.beginPath();
            context.arc(x, y, 160, 0, 2 * Math.PI, false);
            context.fillStyle = 'rgba(0,255,0,0.1)';
            context.fill();
            context.lineWidth = 3;
            context.strokeStyle = 'rgba(0,255,0,0.3)';
            context.stroke();
        }
        
        context.beginPath();
        context.arc(x, y, 20, 0, 2 * Math.PI, false);
        context.fillStyle = '#000000';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#303030';
        context.stroke();
        
        context.beginPath();
        context.lineWidth = 18;
        context.strokeStyle = '#333333';
        context.lineCap = 'round';
        context.moveTo(options.stick.x, options.stick.y);
        context.lineTo(x, y);
        context.stroke();
        
        context.beginPath();
        context.arc(options.stick.x, options.stick.y, 18, 0, 2 * Math.PI, false);
        context.fillStyle = '#dd2222';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#aa1111';
        context.stroke();
        
        context.beginPath();
        context.arc(options.stick.x + 6, options.stick.y - 6, 4, 0, 2 * Math.PI, false);
        context.fillStyle = '#ffcccc';
        context.fill();
    }
}); 
/**
 * Color Transition is a helper class that will smoothly transition one color to another
 */
TwoCylinder.Utilities.ColorTransition = (function(){
    /**
     * colors should be either an array or an object keyd to where in the transition percentage it should shift
     * ie, {0:red, 25:blue, 75:orange} will start red, shift to blue by 25%, then to orange by 75%
     * NOTE: Must use same the number of digits for each or else 5 will preempt 1.25
     */
    var singleColorTransition = function(startColor, stopColor, duration) {
        this.getColorAtStep = function(step) {
            return this.getColorAtPercent(step / duration);
        };

        this.getColorAtPercent = function(percent) {
            //TODO: How do you mix 2 colors?
            return (stopColor * percent) + (startColor * (1-percent));
        }
    };

    return function(colors, duration) {
        this._colors = [];
        this._transitions = [];
        var that = this;

        // we convert the colors array into a usable form and save it is this._transition
        if (Array.isArray(colors)) {
            var length = colors.length;
            _.each(colors, function(c, index) {
                that._colors.push({
                    keypoint : parseFloat(index / length),
                    color : c
                });

            });
        } else {
            _.sortedIndex(colors);
            _.each(colors, function(c, index){
                that._colors.push({
                    keypoint : parseFloat(index),
                    color : c
                })
            });
        }

        // this creates the transitions array (converting all single colors and keypoints
        // into transition objects
        for (var i=1; i<this._colors.length; i++) {
            this._transitions.push(new singleColorTransition(
                this._colors[i-1].color,
                this._colors[i].color,
                (this._colors[i].keypoint*duration/100) - (this._colors[i-1].keypoint*duration/100)
            ));
        }

        this._step = 0;

        // this function iterates the step counter
        // TODO: This can be improved using some momoization to record current transitions
        // TODO: so we don't have to keep searching for it
        this.step = function(){
            return this.getColorAtStep(this._step++);
        };

        // this function will return a color at a given step
        this.getColorAtStep = function(step) {
            var i;
            // we find the color that is to start directly after the color at this step finishes
            // transitioning, we know this will be our stop point
            for(i=0; i < this._colors.length; i++) {
                if (this._colors[i].keypoint > step) {
                    // we decrement by 1 because we don't want the stoppoint transition, we want the one
                    // directly before it
                    i--;
                    break;
                }
            }

            // we get the transition
            var transition = this._transitions[i];

            // we determine when this transition started (to work back the relative step)
            var startPoint = this._colors[i].keypoint;

            // we return the color at this transitions relative step
            return transition.getColorAtStep(step - startPoint);
        }
    };
})();
};}));
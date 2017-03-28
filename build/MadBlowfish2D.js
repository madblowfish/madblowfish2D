// --------------------- Auxiliar Functions------------------------ //

/**
 * Converts Radians to Degrees
 * @param {Number} Radian Value
 * @returns {Number} - Angle in Degrees
 */
function RADTODEGREE(angle) {
    return angle * 180 / Math.PI;
}

/**
 * Converts Degrees to Radians
 * @param {Number} Angle Degree Value
 * @returns {Number} - Angle in Radians
 */
function DEGREETORAD(angle) {
    return angle * Math.PI / 180;
}
// ---------------------------------------------------------------- //
// -------------------------- Layers ------------------------------ //

/**
 * Not Accessible Directly from User
 * Must be used by Scene.GetLayer()
 */

function Layer() {
    this.renderables = new Array();
    this.opacity = 1;
    this.hasTransformations = true;
    this.transformation = new Transformation();
    this.visible = true;
}
Layer.prototype = {
    Add: function (renderable) {
        this.renderables.push(renderable);
    },
    Remove: function (renderable) {
        for (var i = 0; i < this.renderables.length; i++) if (this.renderables[i] == renderable) {
            if (this.renderables[i] == renderable) {
                this.renderables.splice(i, 1);
                break;
            }
        }
    },
    SetOpacity: function (opacity) {
        this.opacity = opacity;
    },
    GetOpacity: function () {
        return this.opacity;
    },
    Visible: function(visible) {
        this.visible = visible;
    }
}
// ---------------------------------------------------------------- //
// ----------------------- PreLoad Images ------------------------- //

/**
 * @class
 */
function PreloadImages() {
    this.assets = new Array();
    this.funcUpdate = undefined;
    this.funcComplete = undefined;
    this.funcCompleteObj = undefined;
    this.funcCompleteName = undefined;
    this.counter = 0;
    this.counterLoaded = 0;
}

PreloadImages.prototype = {
    /**
     * Event on Update
     * @memberof PreloadImages.prototype
     * @params {Object} - Object that owns the callback, or callback itself
     * @params {Object} - Callback when this belongs to an Object
     */
    OnUpdate: function (obj, methodName) {
        if (methodName)
        {
            this.funcUpdateObj = obj;
            this.funcUpdateName = methodName;
        } else {
            this.funcUpdate = func;
        }
        return this;
    },
    /**
     * Event on Complete
     * @memberof PreloadImages.prototype
     * @params {Object} - Object that owns the callback, or callback itself
     * @params {Object} - Callback when this belongs to an Object
     */
    OnComplete: function (obj, methodName) 
    {
        if (methodName)
        {
            this.funcCompleteObj = obj;
            this.funcCompleteName = methodName;
        } else {
            this.funcComplete = obj;
        }
        return this;
    },
    /**
     * Number of Images to Be Loaded
     * @memberof PreloadImages.prototype
     * @returns {number} - Number of Images to be Loaded, Nice to get percentage of loaded stuff
     */
    NumberOfImagesToLoad: function () {
        return this.counter;
    },
    /**
     * Number of Loaded Images
     * @memberof PreloadImages.prototype
     * @returns {number} - Number of Loaded Images, Nice to get percentage of loaded stuff
     */
    NumberOfLoadedImages: function () {
        return this.counterLoaded;
    },
    _PreLoadImage: function (src) {
        var image = new Image();
        image.src = src;
        var _this = this;
        image.onload = function (e) {
            _this._LoadedImage(image, src);
        }
    },
    _LoadedImage: function (image, src) {
        this.assets[src] = image;
        this.counterLoaded++;
        if (this.couner != this.counterLoaded) {
            if (this.funcUpdate!==undefined) this.funcUpdate();
            else if (this.funcUpdateObj!==undefined) this.funcUpdateObj[this.funcUpdateName]();
        }
        if (this.counter == this.counterLoaded) {
            if (this.funcComplete!==undefined) this.funcComplete();
            else if (this.funcCompleteObj!==undefined) this.funcCompleteObj[this.funcCompleteName]();
        }
    },
    /**
     * Load Image
     * @memberof PreloadImages.prototype
     * @params {string} - Path to image
     * @returns {Object} - Returns Itself to Chain Loading
     */
    Load: function (src) {
        this._PreLoadImage(src, this.counter++);
        return this;
    },
    /**
     * Get Loaded Image
     * @memberof PreloadImages.prototype
     * @params {string} - Path to image
     * @returns {Object} - Image Dom Element Loaded
     */
    GetImage: function (src) {
        return this.assets[src];
    }
};
// ---------------------------------------------------------------- //
// ------------------------ Renderable ---------------------------- //

/**
 * @class
 */
function Renderable() {
    this.transformation = new Transformation();
    this.shape = RenderableShape.Circle;
    this.visible = true;
    this.mouseover = false;
    this.OnCamera = true;
    this.opacity = undefined;
    this.isClickable = false;
    this.width = this.height = 0;
    this.updateFunc = undefined;
    this.updateFuncObj = undefined;
    this.updateFuncName = undefined;
}

Renderable.prototype = {
    /**
    * Set Shape
    * @memberof Renderable.prototype
    * @params {Object} Shape of the Renderable - Important for Mouse Clicking and Culling
    */
    SetShape: function (s) {
        this.shape = s;
    },
    /**
    * Set Visible
    * @memberof Renderable.prototype
    * @params {Boolean} If Visible of Not
    */
    SetVisible: function (visibility) {
        this.visible = visibility;
    },
    /**
    * Is Visible
    * @memberof Renderable.prototype
    * @returns {Boolean} Returns Visibility of the Renderable
    */
    IsVisible: function () {
        return this.visible;
    },
    /**
    * Set On Camera
    * @memberof Renderable.prototype
    * @params {Boolean} Of Camera has any influence on Renderable
    */
    SetOnCamera: function (camera) { // true or false
        this.OnCamera = camera;
    },
    /**
    * Is On Camera
    * @memberof Renderable.prototype
    * @params {Boolean} If Camera has any influence on Renderable
    */
    IsOnCamera: function () {
        return this.OnCamera;
    },
    /**
    * Set Opacity
    * @memberof Renderable.prototype
    * @params {Number} Set Renderable Opacity
    */
    SetOpacity: function (opacity) {
        this.opacity = opacity;
    },
    /**
    * Get Opacity
    * @memberof Renderable.prototype
    * @returns {Number} Get Renderable Opacity
    */
    GetOpacity: function () {
        return this.opacity;
    },
    /**
    * Set Clickable
    * @memberof Renderable.prototype
    * @params {Boolean} Set if Renderable is Clickable or not, Important for Mouse Hover and Out
    */
    SetClickable: function (clickable) {
        this.isClickable = clickable;
    },
    /**
    * Get Width
    * @memberof Renderable.prototype
    * @params {Number} Get Renderable Width Dimension
    */
    GetWidth: function () {
        return this.width;
    },
    /**
    * Get Height
    * @memberof Renderable.prototype
    * @params {Number} Get Renderable Height Dimension
    */
    GetHeight: function () {
        return this.height;
    },
    /**
    * Draw Virtual Method
    * @memberof Renderable.prototype
    * @params {ctx} Canvas Context
    */
    Draw: function (ctx) {
        // Virtual Method
    },
    _Draw: function (ctx) {
        // Using Canvas           
        ctx.save();
        ctx.translate(this.transformation.position.x, this.transformation.position.y);
        ctx.rotate(this.transformation.angle);
        ctx.translate(this.transformation.rotationPivot.x, this.transformation.rotationPivot.y);
        this.Draw(ctx);
        ctx.restore();
    },
    _OnClick: function (mouseX, mouseY) {
        // Virtual Method
    },
    _OnMouseMove: function (mouseX, mouseY) {
        // Virtual Method
    },
    _OnUpdate: function () {
        if (this.updateFunc) this.updateFunc();
        if (this.updateFuncObj) this.updateFuncObj[this.updateFuncName]();
    },
    _update: function (time) {
        this.Update(time);
        // Run Functions
        if (this.updateFunc != undefined) this.updateFunc();
        if (this.updateFuncObj != undefined) this.updateFuncObj[this.updateFuncName]();
    },
    /**
    * Update
    * @memberof Renderable.prototype
    * @params {Number} Time value - Comes from Scene
    */
    Update: function (time) {
        // Virtual Method
    },
    /**
    * On Click
    * @memberof Renderable.prototype
    */
    OnClick: function () {
        // Virtual Method
    },
    /**
    * On Mouse Over
    * @memberof Renderable.prototype
    */
    OnMouseOver: function () {
        // Virtual Method
    },
    /**
    * On Mouse Out
    * @memberof Renderable.prototype
    */
    OnMouseOut: function () {
        // Virtual Method
    },
    /**
    * On Update Callback
    * @memberof Renderable.prototype
    */
    OnUpdate: function (obj, name) {
        if (name === undefined) {
            this.updateFunc = obj;
        } else {
            this.updateFuncObj = obj;
            this.updateFuncName = name;
        }
    }
};
// ---------------------------------------------------------------- //
// ------------- Shape for Mouse Click and Culling ---------------- //

/**
 * Renderable Shape - Important for mouse events and culling
 */
var RenderableShape = {
    Circle: 1,
    Quad: 2
};
// ---------------------------------------------------------------- //
// --------------------------- Scene ------------------------------ //

/**
 * @class
 */
function Scene()
{
    this.camera = { transformation: new Transformation() };
    this.isTranslated = false;
    this.isScaled = false;
    this.opacity = 1;
    this.opacityState = 1;
    this.sceneOpacityChanged = false;
    this.layers = new Array(new Layer());
    this.mouse = new Vector2D();
    this.usingMouse = true;
    this.element = undefined;
    this.isCulling = true;
    this.sceneType = undefined;
    this.initTime = new Date().getTime();
}
Scene.prototype = {

    constructor: Scene,

    /**
     * Update
     * @memberof Scene.prototype
     */
    Update: function () {

        // Timer
        var now = new Date().getTime(), dt = now - (this.time || now);
        this.time = now;
        this.currentTime = (this.time - this.initTime) / 1000;

        if (this.camera.transformation.scale.x != 1 || this.camera.transformation.scale.y != 1) {
            // convert to mouse scaled coordinates
            var SceneOffsetX = (this.GetWidth() - (this.GetWidth() / this.camera.transformation.scale.x)) * .5;
            var SceneOffsetY = (this.GetHeight() - (this.GetHeight() / this.camera.transformation.scale.y)) * .5;
            var mouseXScaled = SceneOffsetX + this.mouse.x * (this.GetWidth() - SceneOffsetX * 2) / this.GetWidth();
            var mouseYScaled = SceneOffsetY + this.mouse.y * (this.GetHeight() - SceneOffsetY * 2) / this.GetHeight();

        }
        for (var l = 0; l < this.layers.length; l++)
        {
            if (this.layers[l].visible)
            {
                for (var i = 0; i < this.layers[l].renderables.length; i++)
                {
                    this.layers[l].renderables[i]._update(this.currentTime);
                    if (this.usingMouse && this.layers[l].renderables[i]!=undefined)
                    {
                        if (this.layers[l].renderables[i].IsVisible() && this.layers[l].renderables[i].isClickable) {
                            if (this.layers[l].renderables[i].IsOnCamera()) {
                                if (this.camera.transformation.scale.x != 1 || this.camera.transformation.scale.y != 1) {
                                    this.layers[l].renderables[i]._OnMouseMove(mouseXScaled - this.camera.transformation.position.x, mouseYScaled - this.camera.transformation.position.y);
                                } else {
                                    this.layers[l].renderables[i]._OnMouseMove(this.mouse.x - this.camera.transformation.position.x, this.mouse.y - this.camera.transformation.position.y);
                                }
                            } else this.layers[l].renderables[i]._OnMouseMove(this.mouse.x, this.mouse.y);
                        }
                    }
                }
            }
        }
    },

    /**
     * Set Global Opacity
     * @memberof Scene.prototype
     * @param {number} Opacity - Global value for all canvas elements
     */
    SetGlobalOpacity: function (opacity) {
        this.opacity = opacity;
    },

    /**
     * Get Layer
     * @memberof Scene.prototype
     * @param {number} layer - Get Layer Instance
     */
    GetLayer: function (layer) {
        if (layer === undefined) layer = 0;

        return this.layers[layer];
    },

    /**
     * Resize
     * @memberof Scene.prototype
     * @param {number} width
     * @param {number} height
     */
    Resize: function (width, height) {
        this.element.width = width;
        this.element.height = height;
    },

    /**
     * Draw
     * @memberof Scene.prototype
     */
    Draw: function () {
        // Virtual Method
    },

    /**
     * Add
     * @memberof Scene.prototype
     * @param {object} Renderable Object
     * @param {number} layer number
     */
    Add: function (sprite, layer) {
        // Default Layer
        if (layer === undefined) layer = 0;

        if (this.layers.length < layer+1) {
            for (var i = 0; i <= layer; i++) {
                if (this.layers[i] === undefined) this.layers[i] = new Layer();
            }
        }

        this.layers[layer].Add(sprite);
    },

    /**
     * Remove
     * @memberof Scene.prototype
     * @param {object} Renderable Object
     * @param {number} layer number
     */
    Remove: function (sprite, layer) {
        // Default Layer
        if (layer === undefined) layer = 0;

        // Remove Renderable from Layer
        this.layers[layer].Remove(sprite);

        // Remove Layer
        if (this.layers[layer].renderables.length==0) this.layers.splice(layer,1);
    },

    /**
     * Get Width
     * @memberof Scene.prototype
     * @returns {number} Get Canvas Width
     */
    GetWidth: function () {
        return this.element.width;
    },

    /**
     * Get Height
     * @memberof Scene.prototype
     * @returns {number} Get Canvas Height
     */
    GetHeight: function () {
        return this.element.height;
    },

    /**
     * Get Time
     * @memberof Scene.prototype
     * @returns {number} Get Scene Time Since Start
     */
    GetTime: function () {
        return this.currentTime;
    },

    /**
     * Disable Mouse
     * @memberof Scene.prototype
     */
    DisableMouse: function() {
        this.usingMouse = false;
    },

    /**
     * Enable Culling
     * @memberof Scene.prototype
     */
    EnableCulling: function() {
        this.isCulling = true;
    },

    /**
     * Disable Culling
     * @memberof Scene.prototype
     */
    DisableCulling: function() {
        this.isCulling = false;
    },

    /**
     * Enable Mouse
     * @memberof Scene.prototype
     */
    EnableMouse: function() {
        this.usingMouse = true;
    },

    _Culling: function (Renderable) {

        if (!this.isCulling) return true;

        var cam = this.camera.transformation.position;
        if (!Renderable.IsOnCamera()) cam = {
            x: 0,
            y: 0
        };

        var a = Renderable.transformation.position.x - Renderable.GetWidth()*.5 * Renderable.transformation.scale.x;
        var b = Renderable.transformation.position.x + Renderable.GetWidth()*.5 * Renderable.transformation.scale.x;
        var c = Renderable.transformation.position.y - Renderable.GetHeight()*.5 * Renderable.transformation.scale.y;
        var d = Renderable.transformation.position.y + Renderable.GetWidth()*.5 * Renderable.transformation.scale.y;

        return ((a<-cam.x + this.GetWidth()) && (-cam.x<b) && (c<-cam.y + this.GetHeight()) && (d>-cam.y));
    },

    _OnClick: function () {
        if (this.usingMouse)
        {
            for (var l = this.layers.length - 1; l >= 0; l--)
            {
                if (this.layers[l].visible)
                {
                    for (var i = this.layers[l].renderables.length - 1; i >= 0; i--) {
                        if (this.layers[l].renderables[i].IsVisible() && this.layers[l].renderables[i].isClickable) {
                            if (this.layers[l].renderables[i].IsOnCamera()) {
                                if (this.layers[l].renderables[i]._OnClick(this.mouse.x - this.camera.transformation.position.x, this.mouse.y + this.camera.transformation.position.y)) {
                                    return true;
                                } // exit double loop
                            } else {
                                if (this.layers[l].renderables[i]._OnClick(this.mouse.x, this.mouse.y)) {
                                    return true;
                                } // exit double loop
                            }
                        }
                    }
                }
            }
        }
        return false;
    },
    _OnMouseMove: function (mouseX, mouseY) {
        if (this.usingMouse)
        {
            if (this.camera.transformation.scale.x != 1 || this.camera.transformation.scale.y != 1) {
                // convert to mouse scaled coordinates
                var SceneOffsetX = (this.GetWidth() - (this.GetWidth() / this.camera.transformation.scale.x)) * .5;
                var SceneOffsetY = (this.GetHeight() - (this.GetHeight() / this.camera.transformation.scale.y)) * .5;
                var mouseXScaled = SceneOffsetX + mouseX * (this.GetWidth() - SceneOffsetX * 2) / this.GetWidth();
                var mouseYScaled = SceneOffsetY + mouseY * (this.GetHeight() - SceneOffsetY * 2) / this.GetHeight();

            }
            for (var l = this.layers.length - 1; l >= 0; l--)
            {
                if (this.layers[l].visible)
                {
                    for (var i = this.layers[l].renderables.length - 1; i >= 0; i--) {
                        if (this.layers[l].renderables[i].IsVisible() && this.layers[l].renderables[i].isClickable) {
                            if (this.layers[l].renderables[i].IsOnCamera()) {
                                if (this.camera.transformation.scale.x != 1 || this.camera.transformation.scale.y != 1) {
                                    this.layers[l].renderables[i]._OnMouseMove(mouseXScaled - this.camera.transformation.position.x, mouseYScaled - this.camera.transformation.position.y);

                                } else {
                                    this.layers[l].renderables[i]._OnMouseMove(mouseX - this.camera.transformation.position.x, mouseY - this.camera.transformation.position.y);
                                }
                            } else this.layers[l].renderables[i]._OnMouseMove(mouseX, mouseY);
                        }
                    }
                }
            }
        }
    },

    _MouseClick: function () {
        this._OnClick();
    },

    _MouseMove: function (event) {
        var x = event.clientX;
        var y = event.clientY;

        x -= this.element.offsetLeft;
        y -= this.element.offsetTop;

        this.mouse.x = x;
        this.mouse.y = y;

        this._OnMouseMove(this.mouse.x,this.mouse.y);
    }
};
// ---------------------------------------------------------------- //

// ------------------------ SceneCanvas --------------------------- //

/**
 * @class
 */
function SceneCanvas(canvas) {
    
    // Call Constructor
    Scene.call(this);

    // This way I can send ID or Canvas Object to allow Offscreen Rendering :)
    if (typeof canvas === "string" )
        this.element = document.getElementById(canvas);
    else 
        this.element = canvas;

    this.context = this.element.getContext('2d');

    this.CreateEventListeners();

}
SceneCanvas.prototype = Object.create(Scene.prototype);
SceneCanvas.prototype.constructor = SceneCanvas;

/**
 * Create Event Listeners
 * @memberof SceneCanvas.prototype
 * You can override this method to apply other events
 */
SceneCanvas.prototype.CreateEventListeners = function()
{
    this.element.addEventListener("mousedown", this, false);
    this.element.addEventListener("mousemove", this, false);

    this.handleEvent = function(event)
    {
        switch (event.type) {
            case 'mousemove':
                this._MouseMove(event);
                break;
            case 'mousedown':
                this._MouseClick(event);
                break;
        };
    }
}

/**
 * Draw
 * @memberof Scene.prototype
 */
SceneCanvas.prototype.Draw = function () {

    var ctx = this.context;

    ctx.clearRect(0, 0, this.element.width, this.element.height);

    for (var l = 0; l < this.layers.length; l++) {

        // Set Default Scene Opacity
        this.opacityState = this.opacity;
        ctx.globalAlpha = this.opacity;
        this.sceneOpacityChanged = this.opacity != 1;

        // Save Context Status
        ctx.save();

        // Layer Transforms
        if (this.layers[l].hasTransformations) 
        {
            ctx.save();
            ctx.translate(this.layers[l].transformation.position.x, this.layers[l].transformation.position.y);
            ctx.rotate(this.layers[l].transformation.angle);
            ctx.scale(this.layers[l].transformation.scale.x, this.layers[l].transformation.scale.y);
        }

        // Not Changed by Camera
        for (var i = 0; i < this.layers[l].renderables.length; i++) 
        {
            if (!this.layers[l].renderables[i].IsOnCamera() && this.layers[l].visible) 
            {
                if (this.layers[l].renderables[i].IsVisible() && this._Culling(this.layers[l].renderables[i])) 
                {
                    // Set Layer Opacity
                    if (this.layers[l].GetOpacity() != 1) {
                        this.opacityState = this.layers[l].GetOpacity();
                        ctx.globalAlpha = this.layers[l].GetOpacity();
                        this.layerOpacityChanged = true;
                    }
                    if (!this.sceneOpacityChanged && this.layers[l].renderables[i].GetOpacity() !== undefined) {
                        this.opacityState = this.layers[l].renderables[i].GetOpacity();
                        ctx.globalAlpha = this.layers[l].renderables[i].GetOpacity();
                    }
                    this.layers[l].renderables[i]._Draw(ctx);

                    // Re Set Scene Opacity if Needed
                    if (this.opacity!=this.opacityState)
                    {
                        this.opacityState = this.opacity;
                        ctx.globalAlpha = this.opacity;
                        this.sceneOpacityChanged = this.opacity != 1;
                    }
                }
            }
        }

        ctx.save();

        // Camera Zoom
        if ((this.camera.transformation.scale.x != 1 || this.camera.transformation.scale.y != 1)) {
            ctx.translate(-this.GetWidth() * (this.camera.transformation.scale.x * 0.5 - 0.5), -this.GetHeight() * (this.camera.transformation.scale.y * 0.5 - 0.5));
            ctx.scale(this.camera.transformation.scale.x, this.camera.transformation.scale.y);
        }

        ctx.translate(this.camera.transformation.position.x, this.camera.transformation.position.y);
        ctx.rotate(-this.camera.transformation.angle);
        ctx.translate(this.camera.transformation.rotationPivot.x,this.camera.transformation.rotationPivot.y);

        // On Camera
        for (var i = 0; i < this.layers[l].renderables.length; i++) {
            if (this.layers[l].renderables[i].IsOnCamera() && this.layers[l].visible) {
                // Set Layer Opacity
                if (this.layers[l].GetOpacity() != 1) {
                    this.opacityState = this.layers[l].GetOpacity();
                    ctx.globalAlpha = this.layers[l].GetOpacity();
                    this.layerOpacityChanged = true;
                }
                if (this.layers[l].renderables[i].IsVisible() && this._Culling(this.layers[l].renderables[i])) {
                    if (!this.sceneOpacityChanged && this.layers[l].renderables[i].GetOpacity() !== undefined) {
                        this.opacityState = this.layers[l].renderables[i].GetOpacity();
                        ctx.globalAlpha = this.layers[l].renderables[i].GetOpacity();
                    }
                    this.layers[l].renderables[i]._Draw(ctx);

                    // Re Set Scene Opacity if Needed
                    if (this.opacity!=this.opacityState)
                    {
                        this.opacityState = this.opacity;
                        ctx.globalAlpha = this.opacity;
                        this.sceneOpacityChanged = this.opacity != 1;
                    }
                }
            }
        }
        ctx.restore();

        // Layer Transforms
        if (this.layers[l].hasTransformations) {
            ctx.restore();
        }

    }
    ctx.restore();
};
// ---------------------------------------------------------------- //
// -------------------------- Sprites ----------------------------- //

/**
 * @class
 */
function Sprite() {
    Renderable.call(this);
    this.textures = [];
    this.textureInUse = 0;
    this.clippingX = 0;
    this.clippingY = 0;
    this.clippingWidth = 0;
    this.clippingHeight = 0;
    this.isClipping = false;
}
Sprite.prototype = Object.create(Renderable.prototype);
Sprite.prototype.constructor = Sprite;

/**
 * Load Texture
 * @memberof Sprite.prototype
 * @params {object} Retrieve Image from PreLoader
 */
Sprite.prototype.LoadTexture = function (image) {
    this.textures.push(image);
}
/**
 * Set Clipping
 * @memberof Sprite.prototype
 * @params {number} Initial x for clipping
 * @params {number} Initial y for clipping
 * @params {number} Width
 * @params {number} Height
 */
Sprite.prototype.SetClipping = function (xInit, yInit, width, height) {
    this.clippingX = xInit;
    this.clippingY = yInit;
    this.clippingWidth = width;
    this.clippingHeight = height;
    this.isClipping = true;
},
/**
 * Disable Clipping
 * @memberof Sprite.prototype
 */
Sprite.prototype.DisableClipping = function () {
    this.isClipping = false;
}
/**
 * Get Width
 * @memberof Sprite.prototype
 * @returns {number} Get Canvas Width
 */
Sprite.prototype.GetWidth = function () {
    if (this.textures.length==0) return 0;
    return (this.isClipping ? this.clippingWidth : this.textures[this.textureInUse].width);
},
/**
 * Get Height
 * @memberof Sprite.prototype
 * @returns {number} Get Canvas Width
 */
Sprite.prototype.GetHeight = function () {
    if (this.textures.length==0) return 0;
    return (this.isClipping ? this.clippingHeight : this.textures[this.textureInUse].height);
}
/**
 * Draw
 * @memberof Sprite.prototype
 * @param {object} canvas context
 */
Sprite.prototype.Draw = function (ctx) {
    if (this.textures.length > 0) {
        ctx.drawImage(
            this.textures[this.textureInUse],
            (this.isClipping ? this.clippingX : 0),
            (this.isClipping ? this.clippingY : 0),
            (this.isClipping ? this.clippingWidth : this.textures[this.textureInUse].width),
            (this.isClipping ? this.clippingHeight :this.textures[this.textureInUse].height),
            (-this.transformation.scale.x * .5) * (this.isClipping?this.clippingWidth:this.textures[this.textureInUse].width),
            (-this.transformation.scale.y * .5) * (this.isClipping?this.clippingHeight:this.textures[this.textureInUse].height),
            (this.isClipping?this.clippingWidth*this.transformation.scale.x:this.transformation.scale.x * this.textures[this.textureInUse].width),
            (this.isClipping?this.clippingHeight*this.transformation.scale.y:this.transformation.scale.y * this.textures[this.textureInUse].height)
        );
    }
}
Sprite.prototype._OnClick = function (mouseX, mouseY) {
    if (this.mouseover) this.OnClick();
    return this.mouseover;
}
Sprite.prototype._OnMouseMove = function (mouseX, mouseY) {
    switch (this.shape) {
        case RenderableShape.Circle:
            var x = (this.transformation.position.x) - mouseX;
            var y = (this.transformation.position.y) - mouseY;
            var s = this.GetWidth() * this.transformation.scale.x * .5;
            
            if ((x * x + y * y) < (s * s)) {
                this.mouseover = true;
                this.OnMouseOver();
            } else {
                if (this.mouseover) this.OnMouseOut();
                this.mouseover = false;
            }
            break;
        case RenderableShape.Quad:
            if (Math.abs(mouseX - (this.transformation.position.x)) < (this.transformation.scale.x * .5) * this.GetWidth() && Math.abs(mouseY - (this.transformation.position.y)) < (this.transformation.scale.y * .5) * this.GetHeight()) {
                this.mouseover = true;
                this.OnMouseOver();
            } else {
                if (this.mouseover) this.OnMouseOut();
                this.mouseover = false;
            }
            break;
    };
}
// ---------------------------------------------------------------- //
// --------------------- Animated Sprites ------------------------- //

/**
 * @class
 */
function SpriteAnimated(fps) {
    Sprite.call(this);
    this.isPlaying = this.isLooping = this.isPaused = false;
    this.repeat = 1;
    this.timerPauseLength = this.timeStart = 0;
    this._frame = 0;
    this._internalRepeat = 1;
    this.yoyo = false;
    this.frameSpeed = fps;
    this.startFunc = undefined;
    this.startFuncObj = undefined;
    this.startFuncName = undefined;
    this.endFunc = undefined;
    this.endFuncObj = undefined;
    this.endFuncName = undefined;
    this.startedPause = false;
    this.startedPauseRecovery = false;
    this.startedAnimation = false;
    this.frameLimit = undefined;
}
SpriteAnimated.prototype = Object.create(Sprite.prototype);
SpriteAnimated.prototype.constructor = SpriteAnimated;

/**
 * Event on Start
 * @memberof SpriteAnimated.prototype
 * @params {Object} - Object that owns the callback, or callback itself
 * @params {Object} - Callback when this belongs to an Object
 */
SpriteAnimated.prototype.OnStart = function (obj, name) {
    if (name === undefined) {
        this.startFunc = obj;
    } else {
        this.startFuncObj = obj;
        this.startFuncName = name;
    }
}
/**
 * Event on Complete
 * @memberof SpriteAnimated.prototype
 * @params {Object} - Object that owns the callback, or callback itself
 * @params {Object} - Callback when this belongs to an Object
 */
SpriteAnimated.prototype.OnComplete = function (obj, name) {
    if (name === undefined) {
        this.endFunc = obj;
    } else {
        this.endFuncObj = obj;
        this.endFuncName = name;
    }
}
SpriteAnimated.prototype._OnStart = function () {
    if (this.startFunc) this.startFunc();
    if (this.startFuncObj) this.startFuncObj[this.startFuncName]();
}
SpriteAnimated.prototype._OnComplete = function () {
    if (this.endFunc) this.endFunc();
    if (this.endFuncObj) this.endFuncObj[this.endFuncName]();
}
/**
 * Is Playing
 * @memberof SpriteAnimated.prototype
 * @returns {Boolean} If is Playing Animation
 */
SpriteAnimated.prototype.IsPlaying = function () {
    return this.isPlaying;
}
/**
 * Number of Frames
 * @memberof SpriteAnimated.prototype
 * @returns {number} Number of Frames
 */
SpriteAnimated.prototype.GetNumberOfFrames = function () {
    return (this.frameLimit?this.frameLimit:this.textures.length)-(this.frameInit?this.frameInit:0);
}

/**
 * Set Initial Frame
 * @memberof SpriteAnimated.prototype
 * @param {number} Frame to Initialize Animation
 */
SpriteAnimated.prototype.SetInitialFrame = function (frame) {
    this.frameInit = frame;
}

/**
 * Set Final Frame
 * @memberof SpriteAnimated.prototype
 * @param {number} Final Frame Animation
 */
SpriteAnimated.prototype.SetFinalFrame = function (frame) {
    this.frameLimit = frame;
}

SpriteAnimated.prototype._update = function (time) {

    // ---------- Fetch Timers ---------- 
    if (this.startedAnimation) {
        this.startedAnimation = false;
        this.timeStart = time;
    }
    if (this.startedPause) {
        this.isPaused = true;
        this.startedPause = false;
        this.timerPauseStart = time;
    }
    if (this.startedPauseRecovery) {
        this.startedPauseRecovery = false;
        this.timerPauseEnd = time;
        this.isPaused = false;
        this.timerPauseLength += this.timerPauseEnd - this.timerPauseStart;
    }
    // ---------- End Timers ---------- 

    if (this.isPlaying && !this.isPaused) {
        var _frameSpeed = 1 / this.frameSpeed;
        var _timer = time - (this.timeStart + this.timerPauseLength);
        var frameSize = this.GetNumberOfFrames() * (this.yoyo ? 2 : 1);
        var frame = Math.abs(Math.ceil(_timer / _frameSpeed) - 1);

        if (frame < frameSize) {

            if (this.yoyo && frame >= this.GetNumberOfFrames()) {
                this._frame = (this.GetNumberOfFrames() - (frame - this.GetNumberOfFrames() + 1));
            } else this._frame = frame;

        } else {

            if (this.isLooping) {
                this.timeStart = time;
                this.timerPauseLength = 0;
                this._frame = 0;
            } else if (this.repeat > 0 && this._internalRepeat < this.repeat) {
                this.timeStart = time;
                this.timerPauseLength = 0;
                this._frame = 0;
                this._internalRepeat++;
            } else {
                this._internalRepeat = 1;
                this.isPlaying = false;
                this._frame = (this.yoyo ? 0 : frameSize - 1);
                this._OnComplete(); // On End Function
            }
        }
        this._OnUpdate();
    }
    this.textureInUse = (this.reverse?(this.GetNumberOfFrames()-this._frame-1):this._frame)+(this.frameInit?this.frameInit:0);
    this.Update(time);
}
/**
 * Play
 * @memberof SpriteAnimated.prototype
 * @param {number} How many times to repeat the animation : < 1 = loop
 * @param {Boolean} If is to play reverse mode
 */
SpriteAnimated.prototype.Play = function (repeat, reverse) {
    this.repeat = (repeat === undefined ? 0 : repeat);
    this.reverse = (reverse === undefined ? false : true);
    // Set Loop
    this.isLooping = this.repeat <= 0;
    this.isPlaying = true;
    this.OnStart(); // On Start Function

    this.startedAnimation = true;
}
/**
 * YoYo
 * @memberof SpriteAnimated.prototype
 * @param {Boolean} Playing forward and backwards
 */
SpriteAnimated.prototype.YoYo = function (yoyo) {
    this.yoyo = yoyo;
}
/**
 * Pause
 * @memberof SpriteAnimated.prototype
 */
SpriteAnimated.prototype.Pause = function () {
    if (!this.isPaused) {
        // var to get timer
        this.startedPause = true;

    } else {

        // var to get timer
        this.startedPauseRecovery = true;
    }
}
/**
 * Stop
 * @memberof SpriteAnimated.prototype
 */
SpriteAnimated.prototype.Stop = function () {
    this.isPlaying = false;
    this._frame = 0;
}
// ---------------------------------------------------------------- //
// ---------------- Animated Sprites From Atlas ------------------- //

/**
 * @class
 */
function SpriteAnimatedAtlas(fps) {
    SpriteAnimated.call(this, fps);
}

SpriteAnimatedAtlas.prototype = Object.create(SpriteAnimated.prototype);

SpriteAnimatedAtlas.prototype.constructor = SpriteAnimatedAtlas;

/**
 * Load Atlas Image and Get Each Frame
 * @memberof SpriteAnimatedAtlas.prototype
 * @params {Object} - Image Object
 * @params {Number} - Width of each frame
 * @params {height} - Height of each frame
 * @params {numberOfFrames} - Number of Frames in Atlas
 */
SpriteAnimatedAtlas.prototype.LoadTexture = function(image, framePerColumn, framePerLine, numberOfFrames) {
    
    SpriteAnimated.prototype.LoadTexture.call(this, image);

    this.numberOfFrames = numberOfFrames;
    this.framePerColumn = framePerColumn;
    this.framePerLine = framePerLine;
    this.frameWidth = image.width/framePerColumn;
    this.frameHeight = image.height/framePerLine;
}

/**
 * Number of Frames
 * @memberof SpriteAnimated.prototype
 * @returns {number} Number of Frames
 */
SpriteAnimatedAtlas.prototype.GetNumberOfFrames = function () {
    return (this.frameLimit?this.frameLimit:this.numberOfFrames)-(this.frameInit?this.frameInit:0);
}

SpriteAnimatedAtlas.prototype._update = function (time) {

    SpriteAnimated.prototype._update.call(this, time);

    var frameToPlay = this.textureInUse;
    this.textureInUse = 0;

    this.SetClipping((frameToPlay%this.framePerColumn)*this.frameWidth,Math.floor(frameToPlay/this.framePerColumn)*this.frameHeight, this.frameWidth, this.frameHeight);
}

// ---------------------------------------------------------------- //
// -------------------------- Text 2D ----------------------------- //

/**
 * @class
 */
function Text2D() {
    Renderable.call(this);
    this.font = undefined;
    this.lineHeight = 0;
    this.text = [];
}
Text2D.prototype = Object.create(Renderable.prototype);
Text2D.prototype.constructor = Text2D;
/**
 * Set Font
 * @memberof Text2D.prototype
 * @params {string} Font
 */
Text2D.prototype.SetFont = function (font) {
    this.font = font;
}
/**
 * Set Color
 * @memberof Text2D.prototype
 * @params {string} Color
 */
Text2D.prototype.SetColor = function (color) {
    this.color = color;
}
/**
 * Set Text
 * @memberof Text2D.prototype
 * @params {string} Text
 */
Text2D.prototype.SetText = function (text) {
    this.text = text.split("\n");
    var buffer = document.createElement('canvas');
    buffer.width = 10000;
    buffer.height = 10000;
    var ctx = buffer.getContext('2d');
    ctx.font = this.font;
    var dim = ctx.measureText(this.text[0]);
    this.width = this.height = dim.width; // its like this for now to work with culling
}
/**
 * Set Line Height
 * @memberof Text2D.prototype
 * @params {number} Line Height
 */
Text2D.prototype.SetLineHeight = function(value)
{
    this.lineHeight = value;
}
/**
 * Draw
 * @memberof Text2D.prototype
 * @params {object} Canvas Context
 */
Text2D.prototype.Draw = function (ctx) {

    ctx.translate(-this.GetWidth()*.5,0);
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    for (var i=0;i<this.text.length;i++)
    {
        ctx.fillText(this.text[i], 0, i*this.lineHeight);
    }
}
// ---------------------------------------------------------------- //
// ---------------------- Transformations ------------------------- //

/**
 * @class
 */
function Transformation()
{
    this.position = new Vector2D();
    this.scale = new Vector2D(1,1);
    this.angle = 0;
    this.rotationPivot = new Vector2D();
}
Transformation.prototype = {

    /**
     * Set Rotation
     * @memberof Transformation.prototype
     * @params {number} angle
     */
    SetRotation:function(angle)
    {
        this.angle = angle || 0;
    },

    /**
     * Clear Transforms
     * @memberof Transformation.prototype
     */
    ClearTransforms: function()
    {
        this.transformation.position = new Vector2D();
        this.transformation.scale = new Vector2D();
        this.angle = 0;
        this.rotationPivot = new Vector2D();
    }
}
// ---------------------------------------------------------------- //
// ----------------------- Vector2D ------------------------------- //

/**
 * @class
 */
function Vector2D(x,y)
{
    this.x = x || 0;
    this.y = y || 0;
}
Vector2D.prototype = {
    /**
     * Set X
     * @memberof Vector2D.prototype
     * @params {number} - Set X Value
     */
    SetX: function(x) { this.x = x || 0; },
    /**
     * Set Y
     * @memberof Vector2D.prototype
     * @params {number} - Set Y Value
     */
    SetY: function(y) { this.y = y || 0; },
    /**
     * Get X
     * @memberof Vector2D.prototype
     * @returns {number} - Get X Value
     */
    GetX: function() { return this.x; },
    /**
     * Get Y
     * @memberof Vector2D.prototype
     * @returns {number} - Get Y Value
     */
    GetY: function() { return this.y; },
    /**
     * Get Magnitude Square
     * @memberof Vector2D.prototype
     * @returns {number} - Get Magnitude Squared Value
     */
    MagnitudeSQR: function()
    {
        return this.x * this.x + this.y * this.y;
    },
    /**
     * Get Magnitude
     * @memberof Vector2D.prototype
     * @returns {number} - Get Magnitude Value
     */
    Magnitude: function()
    {
        return Math.sqrt(this.MagnitudeSQR());
    },
    /**
     * Add
     * @memberof Vector2D.prototype
     * @param {object} - Vector to Add
     * @returns {object} - Vector Sum
     */
    Add: function(vec) 
    { 
        if (vec instanceof Vector2D)
            return new Vector2D(this.x+vec.x, this.y+vec.y);
        else
            return new Vector2D(this.x+vec, this.y+vec);
    },
    /**
     * Sub
     * @memberof Vector2D.prototype
     * @param {object} - Vector to Subtract
     * @returns {object} - Vector Subtracted
     */
    Sub: function(vec) 
    {
        if (vec instanceof Vector2D)
            return new Vector2D(this.x-vec.x, this.y-vec.y);
        else
            return new Vector2D(this.x-vec, this.y-vec);
    },
    /**
     * Mul
     * @memberof Vector2D.prototype
     * @param {object} - Vector to Multiply
     * @returns {object} - Vector Multiplied
     */
    Mul: function(vec) 
    {
        if (vec instanceof Vector2D)
            return new Vector2D(this.x*vec.x,this.y*vec.y); 
        else
            return new Vector2D(this.x*vec,this.y*vec); 
    },
    /**
     * Div
     * @memberof Vector2D.prototype
     * @param {object} - Vector to Divide
     * @returns {object} - Vector Divided
     */
    Div: function(vec) 
    {
        if (vec instanceof Vector2D)
            return new Vector2D(this.x/vec.x,this.y/vec.y); 
        else
            return new Vector2D(this.x/vec,this.y/vec); 
    },
    /**
     * Distance Square
     * @memberof Vector2D.prototype
     * @param {object} - Vector to measure Distance
     * @returns {number} - Distance Squared
     */
    DistanceSQR: function(vec)
    {
        var dist = this.Sub(vec);
        return dist.MagnitudeSQR();
    },
    /**
     * Distance
     * @memberof Vector2D.prototype
     * @param {object} - Vector to measure Distance
     * @returns {number} - Distance
     */
    Distance: function(vec)
    {
        var dist = this.Sub(vec);
        return dist.Magnitude();
        Math.sqrt(this.x)
    },
    /**
     * Negate
     * @memberof Vector2D.prototype
     */
    Negate: function()
    {
        this.x = -this.x;
        this.y = -this.y;
    },
    /**
     * Abs
     * @memberof Vector2D.prototype
     * @returns {object} - Absolute Vector
     */
    Abs: function()
    {
        return new Vector2D(Math.abs(this.x),Math.abs(this.y));
    },
    /**
     * Normalize
     * @memberof Vector2D.prototype
     * @returns {object} - Normalized Vector
     */
    Normalize: function()
    {
        var m = this.Magnitude();
        if (m==0) m=1;
        return new Vector2D(this.x/m, this.y/m)
    }
}
// ---------------------------------------------------------------- //--- //
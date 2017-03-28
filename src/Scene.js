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

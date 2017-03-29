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

    // Change Coordinate System
    ctx.save();
    ctx.translate(this.GetWidth()*.5, this.GetHeight()*.5);

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

    ctx.restore();
};
// ---------------------------------------------------------------- //

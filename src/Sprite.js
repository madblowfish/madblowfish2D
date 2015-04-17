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
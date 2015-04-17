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
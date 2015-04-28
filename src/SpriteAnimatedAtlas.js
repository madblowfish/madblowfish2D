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
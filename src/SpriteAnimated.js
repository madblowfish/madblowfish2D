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
    this.textureInUse = (this.reverse?(this.GetNumberOfFrames()-this._frame-1):this._frame)+this.frameInit;
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
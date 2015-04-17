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
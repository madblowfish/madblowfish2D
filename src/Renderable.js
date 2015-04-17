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
    IsClickable: function (clickable) {
        if (clickable === undefined) return this.isClickable;
        else this.isClickable = clickable;
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
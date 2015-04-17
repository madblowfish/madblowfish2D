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
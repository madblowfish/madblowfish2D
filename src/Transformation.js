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
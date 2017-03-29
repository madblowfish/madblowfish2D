// ----------------------- Vector2D ------------------------------- //

/**
 * @class
 */
function Vector2D(x,y)
{
    this.x = x || 0;
    this.y = y || 0;
}
Vector2D.prototype = {
    /**
     * Set X
     * @memberof Vector2D.prototype
     * @params {number} - Set X Value
     */
    SetX: function(x) { this.x = x || 0; },
    /**
     * Set Y
     * @memberof Vector2D.prototype
     * @params {number} - Set Y Value
     */
    SetY: function(y) { this.y = y || 0; },
    /**
     * Get X
     * @memberof Vector2D.prototype
     * @returns {number} - Get X Value
     */
    GetX: function() { return this.x; },
    /**
     * Get Y
     * @memberof Vector2D.prototype
     * @returns {number} - Get Y Value
     */
    GetY: function() { return this.y; },
    /**
     * Get Magnitude Square
     * @memberof Vector2D.prototype
     * @returns {number} - Get Magnitude Squared Value
     */
    MagnitudeSQR: function()
    {
        return this.x * this.x + this.y * this.y;
    },
    /**
     * Get Magnitude
     * @memberof Vector2D.prototype
     * @returns {number} - Get Magnitude Value
     */
    Magnitude: function()
    {
        return Math.sqrt(this.MagnitudeSQR());
    },
    /**
     * Add
     * @memberof Vector2D.prototype
     * @param {object} - Vector to Add
     * @returns {object} - Vector Sum
     */
    Add: function(vec)
    {
        if (vec instanceof Vector2D)
            return new Vector2D(this.x+vec.x, this.y+vec.y);
        else
            return new Vector2D(this.x+vec, this.y+vec);
    },
    /**
     * Sub
     * @memberof Vector2D.prototype
     * @param {object} - Vector to Subtract
     * @returns {object} - Vector Subtracted
     */
    Sub: function(vec)
    {
        if (vec instanceof Vector2D)
            return new Vector2D(this.x-vec.x, this.y-vec.y);
        else
            return new Vector2D(this.x-vec, this.y-vec);
    },
    /**
     * Mul
     * @memberof Vector2D.prototype
     * @param {object} - Vector to Multiply
     * @returns {object} - Vector Multiplied
     */
    Mul: function(vec)
    {
        if (vec instanceof Vector2D)
            return new Vector2D(this.x*vec.x,this.y*vec.y);
        else
            return new Vector2D(this.x*vec,this.y*vec);
    },
    /**
     * Div
     * @memberof Vector2D.prototype
     * @param {object} - Vector to Divide
     * @returns {object} - Vector Divided
     */
    Div: function(vec)
    {
        if (vec instanceof Vector2D)
            return new Vector2D(this.x/vec.x,this.y/vec.y);
        else
            return new Vector2D(this.x/vec,this.y/vec);
    },
    /**
     * Distance Square
     * @memberof Vector2D.prototype
     * @param {object} - Vector to measure Distance
     * @returns {number} - Distance Squared
     */
    DistanceSQR: function(vec)
    {
        var dist = this.Sub(vec);
        return dist.MagnitudeSQR();
    },
    /**
     * Distance
     * @memberof Vector2D.prototype
     * @param {object} - Vector to measure Distance
     * @returns {number} - Distance
     */
    Distance: function(vec)
    {
        var dist = this.Sub(vec);
        return dist.Magnitude();
        Math.sqrt(this.x)
    },
    /**
     * Negate
     * @memberof Vector2D.prototype
     */
    Negate: function()
    {
        this.x = -this.x;
        this.y = -this.y;
    },
    /**
     * Abs
     * @memberof Vector2D.prototype
     * @returns {object} - Absolute Vector
     */
    Abs: function()
    {
        return new Vector2D(Math.abs(this.x),Math.abs(this.y));
    },
    /**
     * Normalize
     * @memberof Vector2D.prototype
     * @returns {object} - Normalized Vector
     */
    Normalize: function()
    {
        var m = this.Magnitude();
        if (m==0) m=1;
        return new Vector2D(this.x/m, this.y/m)
    }
}
// ---------------------------------------------------------------- //--- //

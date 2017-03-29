# MadBlowfish2D
Simple Canvas Framework used in our website: http://www.madblowfish.com

#Sprite Example

```sh
// Our Global Vars
var scene, loader;

// Initialize
var Init = function()
{
	// Create Scene and Set Canvas element Id
	scene = new SceneCanvas("CanvasID");
	// Lets Load a Texture
	loader = new PreloadImages();
	// Lets Load out Texture
	loader.Load("../assets/HTML5.png").OnComplete(Loaded);
}
// When our assets are loaded run this function
var Loaded = function()
{
	// Create Our Sprite
	var sprite = new Sprite();
	sprite.LoadTexture(loader.GetImage("../assets/HTML5.png"));
	// Add Sprite to Scene
	scene.Add(sprite);
	// Lets add some circular movement to sprite
	sprite.Update = function(time)
	{
		this.transformation.position.y+=Math.sin(time);
		this.transformation.position.x+=Math.cos(time);
	}

	// Call our loop method for the first time
	Loop();
}
var Loop = function()
{
	// Scene Update
	scene.Update();
	// Draw Scene
	scene.Draw();
	// Loop
	requestAnimationFrame(Loop);
}
```

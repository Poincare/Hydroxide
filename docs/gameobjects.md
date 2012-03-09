#Game objects

So, you've got a bit of code working, but, its not really doing anything.
Let's fix that.

Here's the code we left off with:

```javascript
function init() {
  var c = $("#cnv")[0];
  var context = c.getContext("2d");
  
  var frameTime = 20;
  var engineTime = 20;

  var width = 600; var height = 600;
  
  var id = "cnv";
  
  Hydroxide.start(id, context, frameTime, engineTime, width, height);
}
```

In Hydroxide, in order to draw things, you hook in game objects into the engine. These game objects have certain interfaces which the engine uses to tell the objects about collisions, edge conditions, etc.

But, many times, some game objects may not care about a collision, but, only care about edge conditions. Fortunately, this problem is solved by inheriting from an object that Hydroxide provides.

Hydroxide gives the object `OHGameObj`, which all game objects should inherit from (using Object.create).

OHGameObj has all the properties your object needs, filled with empty/null values:

 * x - x coordinate of object (used for collision detection), bottom left corner
 * y - y coordinate of object (used for collision detection), bottom left corner
 * width - width (for collision detection)
 * height - height (for collision detection)
 * draw - function used to draw the object (called every frame draw)
 * update - called before every draw call, should be used for things like updating coordinates
 * type - a string denoting what type of GameObject it is
 * onCollision - called by the engine when the GameObject "collides" with something else
 * screenClicked - called by the engine whenever *anything* is clicked, passed true or false depending on if the object was clicked  

Nearly all objects will want to override draw() and update(), since these are needed to get anything onto the screen.

The next step is to learn how to put this stuff together to make a simple bouncing rectangle, which you can see in examples/bounce_rect.html

The code is quite self explanatory if you've been able to follow this far, and I encourage you to make modifications to it to see what happens.

You can see some cool stuff in rect_gen.html

But, this stuff is pretty passive, so, to add some interativity, check out docs/clicking.md

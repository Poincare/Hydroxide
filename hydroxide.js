var Hydroxide = (function() {
	//number of frames completed; use for animations
	var frameNum = 0;

  /* canvas context */
  var context;

  var canvas_height;
  var canvas_width;

  var canvas_id;

  /* These are objects that are being used in the game */
  /* Must contain specific public properties:
 * x - x coordinate of object (used for collision detection), bottom left corner
 * y - y coordinate of object (used for collision detection), bottom left corner
 * width - width (for collision detection)
 * height - height (for collision detection)
 * draw - function used to draw the object (called every frame draw)
 * update - called before every draw call, should be used for things like updating coordinates
 * type - a string denoting what type of GameObject it is
 * onCollision - called by the engine when the GameObject "collides" with something else
 * screenClicked - called by the engine whenever *anything* is clicked, passed 
 * true or false depending on if the object was clicked 
 */
 
  var GameObjects = [];
 
/*
 * An integer, read by all functions
 */
  var state;
 
  /*
 * id: id of the canvas tag
 * ct: canvas context
 * fd: delay between each frame being drawn
 * cd: delay between engine checking for collision and such
 * w: width of canvas
 * h: height of canvas
 */
  var start = function (id, ct, fd, cd, w, h) {
    context = ct;
    canvas_id = id;
    canvas_height = h;
    canvas_width = w;

    setInterval(drawFrame, fd);
    setInterval(engineCheck, cd);

  };

  /* check if a point with coordinates x and y is in rectangle A */
  var inRect = function(x, y, A) {
    if(A.x <= x && A.y <= y && y <= (A.y + A.height) && x <= (A.x + A.width)) {
      return true;
    } 

    return false;

  };

  /* this needs to be connected to a mouse click on the canvas by the user of OH */
  var mouseClick = function (e) {
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 

    var gCanvasElement = $("#"+canvas_id)[0];
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;

    for(var i = 0; i<GameObjects.length; i++) {
      GameObjects[i].screenClicked(x, y, inRect(x, y, GameObjects[i])); 
    }
  };

  /* check if "value" is in the range from min to max, inclusive */
  var valueInRange = function(value, min, max) {
    return (value >= min) && (value <= max);
  };

  /* check if two rectangles overlap, aka collide */
  var checkOverlap = function(A, B) {
    var xOverlap = valueInRange(A.x, B.x, B.x+B.width) || valueInRange(B.x, A.x, A.x+A.width);

    var yOverlap = valueInRange(A.y, B.y, B.y + B.height) || valueInRange(B.y, A.y, A.y + B.height);

    return xOverlap && yOverlap;

  };

  /* check collision between all GameObjects */
  var checkCollision = function(selectedObject) {
      for(var i = 0; i<GameObjects.length; i++) {
        if(selectedObject == GameObjects[i]) {
          continue; //don't compare with itself
        }

        else {
          if(checkOverlap(selectedObject, GameObjects[i])) {
            selectedObject.onCollision(GameObjects[i]);             
          }
        }
      }
  };

  /* check if object has hit an edge */
  var checkEdge = function(go) {
    if(go.y <= 0 || go.y+go.height >= canvas_height) {
      go.onEdgeY();
    }

    else if(go.x <= 0 || go.x+go.width >= canvas_width) {
      go.onEdgeX();
    }
  }

  /* engine checking; checks bounds, collisions, clicks, etc. */
  var engineCheck = function() {
    //check for collision
    for(var i = 0; i<GameObjects.length; i++) {
      var selectedObject = GameObjects[i];

      checkEdge(selectedObject);
      checkCollision(selectedObject);
    }
  };

  /* clear screen out */
  var clearContext = function() {
    context.clearRect(0, 0, canvas_width, canvas_height);
  };

  /* do not use externally unless a forced draw frame (which shouldn't happen) is needed */
  var drawFrame = function() {
    //clear context
    clearContext();

    //loop over all the GameObjects
    for(var i = 0; i < GameObjects.length; i++) {
      context.save();
      GameObjects[i].update();
      GameObjects[i].draw(context);
      context.restore();
    } 

		frameNum++;
  };

  /*
 * Register GameObject with Hydroxide 
 * GameObject must follow the laid out properties, or you will all kinds of errors
 */

  var registerObject = function(GameObject) {
    GameObjects.push(GameObject);
  };

  /*
 * Set state, as an integer
 */
  var setState = function(s) {
    state = s;
  }

  /*
 * Get state, as an integer
 */
  var getState = function() {
    return state;
  }

	var getFrameNum = function() {
		return frameNum;
	}

  /* exposed functions that external code can use */
  var exposed = {
    start: start,
    drawFrame: drawFrame,
    engineCheck: engineCheck,
    registerObject: registerObject,
    checkCollision: checkCollision,

    inRect: inRect,
    valueInRange: valueInRange,

    setState: setState,
    getState: getState,

    mouseClick: mouseClick,

    clearContext: clearContext,
	
		getFrameNum: getFrameNum
  };

  return exposed;
})();


/* Use as prototype for new GameObjects
* Use Object.create which is now part of most browsers,
* including IE
*/

var OHGameObj = (function() {
    var x = 0;
    var y = 0;

    var width = 0;
    var height = 0;

    var draw = function (context) {};
    var update = function () {};

    var onCollision = function () {};

    var screenClicked = function () {};

    var onEdgeX = function () {};
    var onEdgeY = function () {};

    var exposed = {
      x:x,
      y:y,
      width: width,
      height: height,
      draw: draw,
      update: update,
      onCollision: onCollision,
      screenClicked: screenClicked
    }
  return exposed;

})();


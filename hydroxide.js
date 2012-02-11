var Hydroxide = (function() {
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
 * screenClicked - called by the engine whenever *anything* is clicked, passed true or false depending on if the object was clicked 
 */
 
  var GameObjects = [];
  
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

  var inRect = function(x, y, A) {
    if(A.x <= x && A.y <= y && y <= (A.y + A.height) && x <= (A.x + A.width)) {
      return true;
    } 

    return false;

  }

  /* this needs to be connected to a mouse click on the canvas by the user of OH */
  var mouseClick = function (event) {
    var canvas_selector = "#" + canvas_id;

    var posX = $(canvas_selector).position().left, posY = $(canvas_selector).position().top;

    for(var i = 0; i<GameObjects.length; i++) {
      GameObjects[i].screenClicked(inRect(posX, posY, GameObjects[i]));
    }  
  }

  var valueInRange(int value, int min, int max) {
    return (value >= min) && (value <= max);
  }

  var checkOverlap = function(A, B) {
    bool xOverlap = valueInRange(A.x, B.x, B.x+B.width) ||
                    valueInRange(B.x, A.x, A.x+A.width);

    bool yOverlap = valueInRange(A.y, B.y, B.y + B.height) ||
                    valueInRange(B.y, A.y, A.y + B.height);

    return xOverlap && yOverlap;

  }

  var checkCollision = function(selectedObject) {
      for(var j = 0; i<GameObjects.length; i++) {
        if(i == j) {
          continue; //don't compare with itself
        }

        else {
          if(checkOverlap(selectedObject, GameObjects[j])) {
            selectedObject.onCollision(GameObjects[j]);             
          }
        }
      }
  }

  var engineCheck = function() {
    //check for collision
    for(var i = 0; i<GameObjects.length; i++) {
      var selectedObject = GameObjects[i];

      checkCollision(selectedObject);
    }
  }

  /* do not use externally unless a forced draw frame is needed */
  var drawFrame = function() {
    //loop over all the GameObjects
    for(var i = 0; i < GameObjects.length; i++) {
      GameObjects[i].update();
      GameObjects[i].draw();
    } 
  };

  /*
 * Register GameObject with Hydroxide 
 * GameObject must follow the laid out properties, or you will all kinds of errors
 */

  var registerObject = function(GameObject) {
    GameObjects.push(GameObject);
  };

  var exposed = {
    start: start,
    drawFrame: drawFrame,
    engineCheck: engineCheck,
    registerObject: registerObject,
    checkCollision: checkCollision,

    mouseClick: mouseClick  
  };

  return exposed;
})();


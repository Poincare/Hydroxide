/*
* HTML5 2D canvas game engine that stays out of your way
*/

var Hydroxide = (function() {
	//number of frames completed; use for animations
	var frameNum = 0;

  /* canvas context */
  var context;

  var canvas_height;
  var canvas_width;

	//canvas ID on DOM (e.g. "canvas")
  var canvas_id;

  //whether or not to check for collisions
  var collisionToggle = true;

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

	/* These are generic objects onto which the game can tack on some data */
	/* They can be literally anything, and, each structure has a name associated with it, so that it may be found again */	
var DataObjects = {};
 
/*
 * An integer, read by all functions
 */
var state;

/*
* Threading system structure; holds all running thread objects
*/
var runningThreads = [];

/*
* Amount of time between thread calls in milliseconds
*/ 
var threadTime = 15;

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

  var collisionDetectionOff()  = function(){
    collisionToggle = false;
  }	

  var collisionDetectionOn() = function() {
    collisionToggle = true;
  }

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

	/* returns distance between (x1, y1) and (x2, y2) */
	var distance = function(x1, y1, x2, y2) {
		var dist = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
		
		return dist; 
	};
	
	/* returns midpoint coordinates as array of (x1, y1) - (x2, y2) */
	var midpoint = function(x1, y1, x2, y2) {
		var res = [Math.abs((x1-x2)/2), Math.abs((y1-y2)/2)]
			
		return res;
	};

	/* returns hyptoteneuse length of a right triangle with bases a and b */
	var rightTriangleBB = function(a, b) {
		return Math.sqrt(a*a + b*b);
	};

	/* returns base length of a right triangle with base a and hypoteneuse c */
	var rightTriangleBH = function(a, c) {
		return Math.sqrt(c*c - a*a);
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
  /* basically fires events on objects */
  var engineCheck = function() {
    //check for collision
    for(var i = 0; i<GameObjects.length; i++) {
      var selectedObject = GameObjects[i];

      checkEdge(selectedObject);
  
      if(!collisionToggle) { 
        checkCollision(selectedObject);
      }
    }
  };

  /* clear screen out */
  var clearContext = function() {
    context.clearRect(0, 0, canvas_width, canvas_height);
  };

  /* draw a frame, immediately, ahead of the loop */
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
  };

  /*
 * Get state, as an integer
 */
  var getState = function() {
    return state;
  };

	/*
	* Get number of frames elapsed
	*/
	var getFrameNum = function() {
		return frameNum;
	};

	/*
	* "threading" subsystem
	* thrTime: amount of time between each thread function call, default 15
	*/
	var initThreading = function(thrTime) {
		threadTime = thrTime;	
	};

	/*
	* Add thread, or, basically start interval
	*/
	var addThread = function(threadObj) {
		id = setInterval(threadObj.main, threadTime);

		threadObj.id = id;
		runningThreads.push(threadObj);

		return id;
	};

	/*
	* Remove thread from running
	* calls killed() in thread object
	*/
	var removeThread = function(id) {
		for(var i = 0; i<runningThreads.length; i++) {
			var rt = runningThreads[i];
			if(rt.id == id) {
				rt.killed();

				//remove running thread
				clearInterval(id);
				runningThreads.splice(i, 1);
			}
		}
	};

	/*
	* Get array of running threads
	*/
	var getRunningThreads = function() {
		return runningThreads;
	};

	/* Code section for DataObjects */
	
	/* Do not use DataObject to register game objects, because the name system is meant for programmers, not computers! */
	var registerDataObject = function(name, obj) {
		if(name in DataObjects) {
			return -1;
		}

		DataObjects[name] = obj;
		return 0;
	};


	var getDataObject = function(name) {
		if(name in DataObjects) {
			return DataObjects[name];
		}
	
		else {
			return -1;
		}

	};


	/* essentially the same as registerDataObject */
	var updateDataObject = function(name, obj) {
		return registerDataObject(name, obj);
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
		distance: distance,

    setState: setState,
    getState: getState,

    mouseClick: mouseClick,

    clearContext: clearContext,
	
		getFrameNum: getFrameNum,

		initThreading: initThreading,
		addThread: addThread,
		removeThread: removeThread,
		getRunningThreads: getRunningThreads,

		registerDataObject: registerDataObject,
		getDataObject: getDataObject,
		updateDataObject: updateDataObject
  };

  return exposed;

})();


/* Hydroxide thread object
* All threads should derive from this object
* use Object.create
* paused() is currently unused
*/
var OHThread = (function() {
	//called when thread is started
	var main = function() {};

	//called when thread is killed
	var killed = function() {};

	//called when thread is paused
	var paused = function () {}

	var exposed = {
		main: main,
		killed: killed,
		paused: paused
	};

	return exposed;

});


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
  };

  return exposed;

})();

/* Specific purpose objects derived from OHGameObj - make your life easier */
/* You don't have to use these; in fact, it may be beneficial to not use them, but, using them makes development quicker */
/* for low-level animation; set number of frames, calls a function on draw with a frame number */
var OHBasicAnimatedObj = (function() {	
	var obj = Object.create(OHGameObj);

	obj.frames = 1;
 
	obj.setFrames = function(f) {
		this.frames = f;
	};

	//override!
	obj.drawFrame = function(frameNum) {};

	obj.draw = function(f) {
		for(var i = 0; i<this.frames; i++) {
			obj.drawFrame(i);
		}
	};

	return obj;

})();

/* an edge bouncing object; used a lot, so, why not abstract it? */
var OHWallBouncingObj = (function() {
	var obj = Object.create(OHGameObj);
	
	obj.xspeed = 1;
	obj.yspeed = 1;

	obj.onEdgeX = function() {
		this.xspeed = -this.xspeed;
	};

	obj.onEdgeY = function() {
		this.yspeed = -this.yspeed;
	};

  obj.update = function() {
    this.x += obj.xspeed;
    this.y += obj.yspeed;
  };

	return obj;
})();


/* adds a draw swtich; if you don't want to draw the object anymore, just set this.draw to false */
var OHDrawSwitchObj = (function() {
	var obj = Object.create(OHGameObj);
	
	obj.drawSwitch = true;

	obj.draw = function() {
		if(obj.drawSwitch) {
			return;
		}

		obj.drawSwitchOn();
	};

	return obj;
})();

/* adds a update switch; if you don't want to update the object anymore, just set this.update to false */
var OHUpdateSwitchObj = (function() {
	var obj = Object.create(OHGameObj);
	
	obj.updateSwitch = true;
	
	obj.update = function() {
		if(obj.updateSwitch) {
			return;
		}

		obj.updateSwitchOn();
	};
		
	return obj;
})();

var OHMovingImageObj = (function() {
	var obj = Object.create(OHGameObj);
	
	obj.image = "";
	
	obj.imageObj = null;

	obj.setImage = function(im) {
		this.imageObj = new Image();
	};

	obj.draw = function() {
		context.drawImage(this.imageObj, this.x, this.y);	
	};

	return obj;
})();

var OHSquareObj = (function() {
	var obj = Object.create(OHGameObj);
	
	this.width = 0;
	this.height = 0;
	
	obj.setDimension = function(x) {
		this.width = x;
		this.height = x; 
	}
})();

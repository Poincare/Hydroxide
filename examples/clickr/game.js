//small clicking and object generation example
function createClass() {
  /* inherit from the main OHGameObj class, provided by Hydroxide */
  var GameObj = Object.create(OHGameObj);

  GameObj.xspeed = 1;
  GameObj.yspeed = 1;

	GameObj.x = 0;
	GameObj.y = 0;
	
	GameObj.centerx = 150;
	GameObj.centery = 0;

	GameObj.radius = 15;

  GameObj.width = 50;
  GameObj.height = 50;

	GameObj.toDraw = true;

  GameObj.draw = function(context) {
		if(!this.toDraw) {
			return;
		}

 		context.beginPath();
		context.arc(this.centerx, this.centery, 15, 0, 2 * Math.PI, false);
		context.fillStyle = "#8ED6FF";
		context.fill();
		context.closePath(); 
		//context.fillRect(this.x, this.y, this.width, this.height);
	
		this.centerToCoor();
  };

	GameObj.centerToCoor = function() {
		this.x = this.centerx - this.radius;
		this.y = this.centery - this.radius;
	}

  GameObj.update = function() {
    this.centery += this.yspeed;
		this.centerToCoor();
  };
  
	GameObj.type = "circle";

  GameObj.onEdgeY = function () {
  	this.toDraw = false;   
  };

	GameObj.onEdgeX = function() {
		this.toDraw = false;
	};

  //change color of the rectangles
  GameObj.screenClicked = function(posX, posY, inMe) {
		if(inMe) {
			this.toDraw = false;
			obj = Hydroxide.getDataObject("gameStats");

			obj["points"]++;

			Hydroxide.updateDataObject("gameStats", obj);	
		}
		console.log("Screen clicked!");
  } 

  return GameObj;
}

function addObject() {
	var GameObj = createClass();
	var g = Object.create(GameObj);

	g.centerx = Math.floor(Math.random() * parseInt($("#cnv").attr("width")));
	g.centery = g.radius;

	g.yspeed = Math.random() * 2;	
	Hydroxide.registerObject(g);
}

function init() {
  var c = $("#cnv")[0];
  var context = c.getContext("2d");

  var GameObj = createClass();
  
	$("#cnv").click(Hydroxide.mouseClick);

	setInterval("addObject()", 600);

	var gameStats = {"points":0}

	Hydroxide.registerObject(GameObj);
	Hydroxide.registerDataObject("gameStats", gameStats);

  Hydroxide.start("cnv", context, 20, 20, 600, 600);
}

$(document).ready(init);


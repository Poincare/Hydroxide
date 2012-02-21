#Canvas

Hydroxide is really easy to get started with.

Set up a simple HTML document with a canvas tag:

  <!doctype html>
  <html>
    <head>
      <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
      <script src="hydroxide.js"></script>
    </head>
    <body>
      <canvas width="600" height="600" id="cnv"></canvas>
    </body>
  </html>

Notice that I specified a HTML5 doctype; you'll need for things to render correctly in some browsers.

You'll want to link in hydroxide.js with a script tag and similarly with jQuery.

Now, you'll need to add a script tag, or link in a script file, I'm just going to assume you added a new file.

This is what you'd begin with in this file (using jQuery): 

  function init() {

  }

  $(document).ready(init)


This is pretty standard code.

Now, for Hydroxide to start, you need a couple of things handled first.

  function init() {
    var c = $("#cnv")[0];
    var context = c.getContext("2d");
    
    var frameTime = 20;
    var engineTime = 20;
  
    var width = 600; var height = 600;
    
    var id = "cnv"
  }

  $(document).ready(init);

As you can see, the code is getting the canvas element from the DOM, then, retreiving the context.

frameTime specifies the amount of time (in miliseconds) between each frame is drawn.

engineTime specifies the amount of time (in miliseconds) between each engine check (which checks for collisions, clicks, etc.)

width and height are, of course, the width and height of the canvas element, in pixels.

id is the ID in the DOM of the canvas tag.

All we have to do now is to pass on these arguments in the right order to Hydroxide:

  function init() {
    var c = $("#cnv")[0];
    var context = c.getContext("2d");
    
    var frameTime = 20;
    var engineTime = 20;
  
    var width = 600; var height = 600;
    
    var id = "cnv";
    
    Hydroxide.start(id, context, frameTime, engineTime, width, height);
  }

  $(document).ready(init);



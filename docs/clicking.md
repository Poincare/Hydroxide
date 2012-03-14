#Clicking

Now, you've got the basics down, but, we've yet to add some interactivity.

Let's add click support.

Click handling is *incredibly* easy in Hydroxide.

First, we need to link the "onclick" with the Hydroxide.mouseClick handler.

We can do this using jQuery:

```javascript
$("#cnv").click(Hydroxide.mouseClick);
```

What this is does is that it lets Hydroxide know whenever the canvas is clicked, so that Hydroxide can fire off events on the game objects.

To handle clicks inside your GameObjects, implement the screenClicked method:

```javascript
GameObj.screenClicked = function(posX, posY, inMe) {
	//whatever
}
```

posX and posY give you the coordinates of the click, and inMe is a boolean value specifying whether the click was in the rectangle defined by the game object on which the event is being read.

Hydroxide calls *all* game objects' screenClicked method whenever there is a click on the canvas; you get to decide whether or not to act upon it.

Check out the rect_inme.html and rect_click.html examples to learn more.

Keyboard input is coming soon!


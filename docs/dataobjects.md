#DataObjects

Often times, you need to share data between your GameObjects in your game. For example, you might have a point counter that needs to be accessible everywhere.

Hydroxide provides a very simple mechanism for that. Basically, Hydroxide has a internal DataObjects object, which relates a name to another object.

So, practially:

```javascript
gameStats = {"points":0};

Hydroxide.registerDataObject("gameStats", gameStats);
```

That registers the object gameStats under the name of "gameStats".

To retrieve this object at a later time:

```javascript
gameStats = Hydroxide.getDataObject("gameStats");

console.log(gameStats["points"])
```

To update the object:

```javascript
gameStats = Hydroxide.getDataObject("gameStats");
gameStats["points"]++;

Hydroxide.updateDataObject("gameStats", gameStats); 
```

And, that's it!



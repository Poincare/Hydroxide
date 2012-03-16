#Force draw frame

Sometimes, if you've just updated a crucial object and it can't wait for the next draw cycle, you can force Hydroxide to immediately draw a frame.

The code is simple:

```javascript
Hydroxide.drawFrame()
```

In normal circumstances, you shouldn't need to do this, but, you can if you must.

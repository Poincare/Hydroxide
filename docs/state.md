#State

Almost all games are designed as state machines; i.e. depending on stimuli and situations, they change state and react accordingly.

Hydroxide has some simple central state methods (and you are free to implement state machines for each object if you'd like) that you can use.

```javascript
Hydroxide.setState(state)
```

That sets global state of "state", and you can read this state by:

```javascript
Hydroxide.getState()
```

Which returns the state.

Note that Hydroxide leaves you free to set the state as a string, an object, an integer or whatever you'd like.
This is because Javascript does not have a standard way of defining enums, which are typically used in state machines.

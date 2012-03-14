#Threading

Most Javascript implementations at the moment run in one thread of execution.

HTML5 web workers are one of the first solutions to try to introduce concurrency into Javascript, but, they are not a fully developed solution yet (a.k.a IE hasn't implemented them yet).

So, Hydroxide uses a different technique.

Rather than actually creating threads, Hydroxide emulates concurrency by using timers, in which a function is called repeatedly every some amount of milliseconds, just like in a scheduler, but, it doesn't run concurrently, and its the application writer's responsibility to make sure that the function being called ends quickly.

To set up the threading subsystem:

```javascript
Hydroxide.initThreading(threadTime);
```

threadTime is the amount of time (in milliseconds) between call of the thread functions.

To develop a new thread, Hydroxide provides the OHThread object, which one may use to develop a new object around.

```javascript
GameThread = Object.create(OHThread);
```

This object's main method is called repeatedly (as if it was a thread).

To add this to the queue of running threads:

```javascript
id = Hydroxide.addThread(GameThread)
```

Keep track of that id number if you want to kill the thread later on.

You kill the thread like so:

```javascript
Hydroxide.killThread(id)
```

And, that's how threading works.

Keep in mind that its not fully fledged threading; there are no mutexes or semaphores; but, it suffices for many tasks.

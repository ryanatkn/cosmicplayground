import {writable, get} from 'svelte/store';

// I tried to avoid using `get`, but there's one place where it's used.
// Subscribing to the `running` value seems to add a lot of complexity
// to get it working correctly.
// If the store is subscribed to in the function that creates it,
// it'll never reach 0 subscribers and be cleaned up,
// creating a memory leak. There might be better ways to do this.

export const createClock = (initialState = {}) => {
  // initialState: {time?: number, running?: boolean}
  let lastTime, reqId;

  const clock = writable(
    {
      time: initialState.time || 0,
      running: false, // see below for where `initialState.running` is used - the initializing `resume` call expects `clock.running` to be false
      dt: 0,
    },
    () => {
      return () => {
        pause();
      };
    },
  );

  const onTimer = dt => {
    logDroppedFrames(dt);
    clock.update(c => ({...c, time: c.time + dt, dt}));
  };

  const onFrame = t => {
    if (lastTime !== undefined) {
      onTimer(t - lastTime);
    }
    lastTime = t;
    reqId = requestAnimationFrame(onFrame);
  };

  const resume = () => {
    clock.update(c => {
      if (c.running) return;
      lastTime = undefined;
      reqId = requestAnimationFrame(onFrame);
      return {...c, running: true};
    });
  };
  const pause = () => {
    clock.update(c => {
      if (!c.running) return;
      cancelAnimationFrame(reqId);
      return {...c, running: false};
    });
  };
  const toggle = () => {
    get(clock).running ? pause() : resume();
  };

  if (initialState.running !== false) {
    resume();
  }

  return {subscribe: clock.subscribe, resume, pause, toggle};
};

const logDroppedFrames = dt => {
  const expectedFps = 60;
  const expectedMsPerFrame = 1000 / expectedFps;
  if (dt > expectedMsPerFrame + 5) {
    const droppedFrameCount =
      Math.round((10 * (dt - expectedMsPerFrame)) / expectedMsPerFrame) / 10;
    console.warn(
      `(╯°□°)╯︵ ┻━┻ ${droppedFrameCount} frame${
        droppedFrameCount === 1 ? '' : 's'
      } over ${dt.toFixed(1)}ms`,
    );
  }
};

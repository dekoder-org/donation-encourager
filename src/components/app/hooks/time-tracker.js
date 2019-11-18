import { useContext, useState, useEffect, useRef } from "react";
import { Settings, Storage } from "../contexts";

// all times in seconds
const UPDATE_INTERVAL = 1; // update storage every x seconds
const IDLE_THRESHOLD = 15; // stop tracking x seconds of inacticity
const _IDLE_COUNT_TICK_INTERVAL = 1;
const _THROTTLE_DELAY = 1;

export default function useTimeTracker() {
  const { trackerEnabled } = useContext(Settings);
  const { addReadingTime } = useContext(Storage);
  const pageFocussed = usePageFocus(trackerEnabled);
  const isIdle = useIdleTimer(trackerEnabled && pageFocussed);
  useInterval(
    () => addReadingTime(UPDATE_INTERVAL),
    trackerEnabled && !isIdle && pageFocussed ? UPDATE_INTERVAL * 1000 : null
  );
}

function usePageFocus(enabled) {
  const [pageFocussed, setPageFocussed] = useState(true);
  useEffect(() => {
    if (!enabled) return;
    const userLeft = () => setPageFocussed(false);
    const userReturned = () => setPageFocussed(true);
    const onVisibChange = () => (document.hidden ? userLeft() : userReturned());
    const pageFocusEvents = [
      [document, "visibilitychange", onVisibChange],
      [window, "blur", userLeft],
      [window, "focus", userReturned]
    ];
    handleListeners("add", pageFocusEvents);
    return () => handleListeners("remove", pageFocusEvents);
  }, [enabled]);

  return pageFocussed;
}

function useIdleTimer(active) {
  const [isIdle, setIsIdle] = useState(false);
  const [idleCount, setIdleCount] = useState(IDLE_THRESHOLD);
  useEffect(() => {
    if (!active) return;
    const wakeUp = throttle(() => {
      // console.log("wake up / reset idle counter!");
      setIsIdle(false);
      setIdleCount(IDLE_THRESHOLD);
    }, _THROTTLE_DELAY * 1000);
    const wakeUpEvents = [
      [document, "mousemove", wakeUp],
      [document, "keyup", wakeUp],
      [document, "touchstart", wakeUp],
      [window, "wheel", wakeUp]
    ];
    handleListeners("add", wakeUpEvents);
    return () => handleListeners("remove", wakeUpEvents);
  }, [active]);

  useInterval(
    () => setIdleCount(curr => curr - _IDLE_COUNT_TICK_INTERVAL),
    !isIdle && active ? _IDLE_COUNT_TICK_INTERVAL * 1000 : null
  );

  useEffect(() => {
    if (idleCount <= 0) setIsIdle(true);
  }, [idleCount]);

  return isIdle;
}

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => savedCallback.current();
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function handleListeners(addOrRemove, events) {
  events.forEach(array => {
    const [target, eventName, callback] = array;
    addOrRemove === "add"
      ? target.addEventListener(eventName, callback)
      : target.removeEventListener(eventName, callback);
  });
}

// todo
function throttle(func) {
  // ,delay
  return func;
}

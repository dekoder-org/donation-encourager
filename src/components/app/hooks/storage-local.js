import { useEffect } from "react";

export default function useLocalStorageSync(stateData, setStateData, settings) {
  const { crossStorageUrl, storageKey } = settings;

  // (1) state -> localStorage
  useEffect(() => {
    if (crossStorageUrl) return;
    setLocalStorageData(stateData, storageKey);
  }, [stateData, storageKey, crossStorageUrl]);

  // (2) localStorage -> state
  useEffect(() => {
    if (crossStorageUrl) return;
    const storageListener = ev => {
      if (ev.key === storageKey) {
        setStateData(localStorageData(storageKey));
      }
    };
    window.addEventListener("storage", storageListener);
    return () => window.removeEventListener("storage", storageListener);
  }, [storageKey, setStateData, crossStorageUrl]);
}

export function localStorageData(storageKey) {
  if (typeof window === "undefined") return;
  return JSON.parse(window.localStorage.getItem(storageKey));
}

function setLocalStorageData(data = {}, storageKey) {
  window.localStorage.setItem(storageKey, JSON.stringify(data));
}

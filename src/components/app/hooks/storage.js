import { useState, useEffect, useMemo } from "react";

const STORAGE_DEFAULT = {
  readingTime: 0, // in seconds
  readContents: {} // fields = content types
};

// provides localStorage synced state w/ custom getters & setters
export default function useStorage({ storageKey, contentTypes, locale }) {
  const [stateData, setStateData] = useState(
    storageData(storageKey) || STORAGE_DEFAULT
  );
  useStateToStorageSync(stateData, storageKey);
  useStorageToStateSync(setStateData, storageKey);
  const stateSetterObj = useMemo(() => stateSetters(setStateData), []);
  const stateGetterObj = stateGetters(stateData, contentTypes, locale);
  return {
    ...stateData,
    ...stateSetterObj,
    ...stateGetterObj
  };
}

// whenever trackerData changes, change localStorage accordingly:
function useStateToStorageSync(stateData, storageKey) {
  useEffect(() => {
    setStorageData(stateData, storageKey);
  }, [stateData, storageKey]);
}

// listen to localStorage changes from other windows:
function useStorageToStateSync(setStateData, storageKey) {
  useEffect(() => {
    const storageListener = ev => {
      if (ev.key === storageKey) {
        setStateData(storageData(storageKey));
      }
    };
    window.addEventListener("storage", storageListener);
    return () => window.removeEventListener("storage", storageListener);
  }, [storageKey, setStateData]);
}

function stateSetters(setStateData) {
  return {
    reset: () => setStateData(STORAGE_DEFAULT),
    addReadingTime: seconds => {
      setStateData(currentState => {
        return {
          ...currentState,
          readingTime: currentState.readingTime + seconds
        };
      });
    },
    addReadContent: (contentType, plusCount = 1) => {
      // console.log(`+${plusCount} CONTENTS (${contentType})`);
      setStateData(currentState => {
        const prevReadContents = currentState.readContents || {};
        const prevVal = prevReadContents[contentType] || 0;
        return {
          ...currentState,
          readContents: {
            ...prevReadContents,
            [contentType]: prevVal + plusCount
          }
        };
      });
    },
    setReadContents: readContents => {
      setStateData(currentState => {
        // const prevReadContents = currentState.readContents || {};
        return {
          ...currentState,
          readContents: {
            // ...prevReadContents,
            ...readContents
          }
        };
      });
    }
  };
}

function stateGetters(stateData, contentTypes, locale) {
  return {
    get totalContents() {
      return Object.values(stateData.readContents || {}).reduce(
        (acc, curr) => acc + curr,
        0
      );
    },
    get readContentsString() {
      return getContentList(contentTypes, stateData.readContents, locale);
    },
    get readingTimeString() {
      return getTimeString(stateData.readingTime, locale);
    }
  };
}

function setStorageData(data = {}, storageKey) {
  window.localStorage.setItem(storageKey, JSON.stringify(data));
}

function storageData(storageKey) {
  return JSON.parse(window.localStorage.getItem(storageKey));
}

function getContentList(contentTypes, readContents = {}) {
  return Object.keys(contentTypes)
    .filter(type => Object.prototype.hasOwnProperty.call(readContents, type))
    .filter(type => readContents[type])
    .map((type, i, arr) => {
      const val = readContents[type];
      const isLast = i === arr.length - 1;
      const name = contentTypes[type];
      return `${val} ${val === 1 ? name.singular : name.plural}${
        !isLast ? " und " : ""
      }`;
    })
    .join("");
}

function getTimeString(totalSeconds, locale) {
  const lang = locale.split("-")[0];
  // const seconds = totalSeconds % 60;
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);
  return `${hoursStr(hours, lang)}
    ${hours && minutes ? " und " : ""}
    ${minutesStr(minutes, !!hours, lang)}`;

  // ${minutes && seconds ? " und " : ""}
  // ${secondsStr(seconds, lang)}

  function hoursStr(hours) {
    return hours ? (hours === 1 ? "1 Stunde" : `${hours} Stunden`) : "";
  }
  function minutesStr(minutes, hasHours) {
    return minutes
      ? minutes === 1
        ? "1 Minute"
        : `${minutes} Minuten`
      : hasHours
      ? ""
      : "0 Minuten";
  }
  /* function secondsStr(seconds) {
    return seconds ? (seconds === 1 ? "1 Sekunde" : `${seconds} Sekunden`) : "";
  }*/
}

import { useState, useEffect, useMemo } from "react";

const STORAGE_DEFAULT = {
  readingTime: 0, // in seconds
  readContents: {} // fields = content types
};

// provides localStorage synced state w/ custom getters & setters
export default function useStorage({ storageKey, contentTypes, strings }) {
  const [stateData, setStateData] = useState(
    storageData(storageKey) || STORAGE_DEFAULT
  );
  useStateToStorageSync(stateData, storageKey);
  useStorageToStateSync(setStateData, storageKey);
  const stateSetterObj = useMemo(() => stateSetters(setStateData), []);
  const stateGetterObj = stateGetters(stateData, contentTypes, strings);
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
    },
    setMemberValidation: value => {
      setStateData(currentState => ({
        ...currentState,
        memberValidation: value
      }));
    },
  };
}

function stateGetters(stateData, contentTypes, strings) {
  return {
    get totalContents() {
      return Object.values(stateData.readContents || {}).reduce(
        (acc, curr) => acc + curr,
        0
      );
    },
    get readContentsString() {
      return getContentList(contentTypes, stateData.readContents, strings);
    },
    get readingTimeString() {
      return getTimeString(stateData.readingTime, strings);
    }
  };
}

function setStorageData(data = {}, storageKey) {
  window.localStorage.setItem(storageKey, JSON.stringify(data));
}

function storageData(storageKey) {
  return JSON.parse(window.localStorage.getItem(storageKey));
}

function getContentList(contentTypes, readContents = {}, strings) {
  return Object.keys(contentTypes)
    .filter(type => Object.prototype.hasOwnProperty.call(readContents, type))
    .filter(type => readContents[type])
    .map((type, i, arr) => {
      const val = readContents[type];
      const isLast = i === arr.length - 1;
      const name = contentTypes[type];
      return `${val} ${val === 1 ? name.singular : name.plural}${
        !isLast ? ` ${strings.and} ` : ""
      }`;
    })
    .join("");
}

function getTimeString(totalSeconds, strings) {
  // const seconds = totalSeconds % 60;
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);
  return `${hoursStr(hours, strings)}
    ${hours && minutes ? ` ${strings.and} ` : ""}
    ${minutesStr(minutes, !!hours, strings)}`;

  // ${minutes && seconds ? " und " : ""}
  // ${secondsStr(seconds, lang)}

  function hoursStr(hours, strings) {
    return hours
      ? hours === 1
        ? `1 ${strings.hours.singular}`
        : `${hours} ${strings.hours.plural}`
      : "";
  }
  function minutesStr(minutes, hasHours, strings) {
    return minutes
      ? minutes === 1
        ? `1 ${strings.minutes.singular}`
        : `${minutes} ${strings.minutes.plural}`
      : hasHours
      ? ""
      : `0 ${strings.minutes.singular}`;
  }
  /* function secondsStr(seconds, strings) {
    return seconds
      ? (seconds === 1
        ? `1 ${strings.seconds.singular}`
        : `${seconds} ${strings.seconds.plural}`}
      : "";
  }*/
}

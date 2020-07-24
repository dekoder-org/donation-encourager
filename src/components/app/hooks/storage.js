import { useState, useEffect, useMemo } from "react"
import useLocalStorageSync, { localStorageData } from "./storage-local"
import useCrossStorageSync from "./storage-cross"

const STORAGE_DEFAULT = {
  readingTime: 0, // in seconds
  readContents: {}, // fields = content types
}

// provides localStorage synced state w/ custom getters & setters
export default function useStorage(settings, pageFocussed) {
  const { storageKey, contentTypes, strings, crossStorageUrl } = settings
  const initialState = crossStorageUrl
    ? STORAGE_DEFAULT
    : localStorageData(storageKey) || STORAGE_DEFAULT
  const [stateData, setStateData] = useState(initialState)

  useEffect(() => {
    // on page focus: check for changes
    if (crossStorageUrl) return
    if (!pageFocussed) return
    setStateData((sd) => localStorageData(storageKey) || sd)
  }, [pageFocussed, crossStorageUrl, storageKey])

  useLocalStorageSync(stateData, setStateData, settings, pageFocussed)
  useCrossStorageSync(stateData, setStateData, settings)

  const stateSetterObj = useMemo(() => stateSetters(setStateData), [])
  const stateGetterObj = stateGetters(stateData, contentTypes, strings)
  return {
    ...stateData,
    ...stateSetterObj,
    ...stateGetterObj,
  }
}

function stateSetters(setStateData) {
  return {
    reset: () => setStateData(STORAGE_DEFAULT),
    addReadingTime: (seconds) => {
      setStateData((currentState) => {
        return {
          ...currentState,
          readingTime: currentState.readingTime + seconds,
        }
      })
    },
    addReadContent: (contentType, plusCount = 1) => {
      // console.log(`+${plusCount} CONTENTS (${contentType})`);
      setStateData((currentState) => {
        const prevReadContents = currentState.readContents || {}
        const prevVal = prevReadContents[contentType] || 0
        return {
          ...currentState,
          readContents: {
            ...prevReadContents,
            [contentType]: prevVal + plusCount,
          },
        }
      })
    },
    setReadContents: (readContents) => {
      setStateData((currentState) => {
        // const prevReadContents = currentState.readContents || {};
        return {
          ...currentState,
          readContents: {
            // ...prevReadContents,
            ...readContents,
          },
        }
      })
    },
    setMemberValidation: (value) => {
      setStateData((currentState) => ({
        ...currentState,
        memberValidation: value,
      }))
    },
  }
}

function stateGetters(stateData, contentTypes, strings) {
  return {
    get totalContents() {
      const obj = stateData.readContents || {}
      return Object.keys(obj)
        .map((k) => obj[k])
        .reduce((acc, curr) => acc + curr, 0)
    },
    get readContentsString() {
      return getContentList(contentTypes, stateData.readContents, strings)
    },
    get readingTimeString() {
      return getTimeString(stateData.readingTime, strings)
    },
  }
}

function getContentList(contentTypes, readContents = {}, strings) {
  return Object.keys(contentTypes)
    .filter((type) => Object.prototype.hasOwnProperty.call(readContents, type))
    .filter((type) => readContents[type])
    .map((type, i, arr) => {
      const val = readContents[type]
      const isLast = i === arr.length - 1
      const isSecondLast = i === arr.length - 2
      const name = contentTypes[type]
      return `${val} ${val === 1 ? name.singular : name.plural}${
        isLast ? "" : isSecondLast ? ` ${strings.and} ` : ", "
      }`
    })
    .join("")
}

function getTimeString(totalSeconds, strings) {
  // const seconds = totalSeconds % 60;
  const minutes = Math.floor((totalSeconds / 60) % 60)
  const hours = Math.floor(totalSeconds / 3600)
  return `${hoursStr(hours, strings)}
    ${hours && minutes ? ` ${strings.and} ` : ""}
    ${minutesStr(minutes, !!hours, strings)}`

  // ${minutes && seconds ? " und " : ""}
  // ${secondsStr(seconds, lang)}

  function hoursStr(hours, strings) {
    return hours
      ? hours === 1
        ? `1 ${strings.hours.singular}`
        : `${hours} ${strings.hours.plural}`
      : ""
  }
  function minutesStr(minutes, hasHours, strings) {
    return minutes
      ? minutes === 1
        ? `1 ${strings.minutes.singular}`
        : `${minutes} ${strings.minutes.plural}`
      : hasHours
      ? ""
      : `0 ${strings.minutes.singular}`
  }
  /* function secondsStr(seconds, strings) {
    return seconds
      ? (seconds === 1
        ? `1 ${strings.seconds.singular}`
        : `${seconds} ${strings.seconds.plural}`}
      : "";
  }*/
}

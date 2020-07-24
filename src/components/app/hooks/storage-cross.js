import { useState, useEffect, useMemo } from "react"
import { CrossStorageClient } from "cross-storage"

export default function useCrossStorageSync(stateData, setStateData, settings) {
  const { crossStorageUrl, storageKey } = settings
  const [connected, setConnected] = useState(false)
  const [inSync, setInSync] = useState(false)

  // start CrossStorageClient
  const crossStorage = useMemo(() => {
    if (typeof window === "undefined") return
    return typeof crossStorageUrl === "string" && crossStorageUrl
      ? new CrossStorageClient(crossStorageUrl)
      : null
  }, [crossStorageUrl])

  // connect client
  useEffect(() => {
    if (!crossStorage) return
    crossStorage.onConnect().then(() => setConnected(true))
    return () => crossStorage.close()
  }, [crossStorage, storageKey])

  // crossStorage -> state (only once after connection)
  useEffect(() => {
    if (!crossStorage || !connected) return
    // window.crossStorage = crossStorage;
    crossStorage
      .get(storageKey)
      .then(JSON.parse)
      .then((crossStorageData) => {
        if (!crossStorageData || typeof crossStorageData !== "object") return
        setStateData((tmpState) => mergeStates(tmpState, crossStorageData))
        setInSync(true)
      })
  }, [setStateData, connected, crossStorage, storageKey])

  // state -> crossStorage
  useEffect(() => {
    if (!crossStorage || !inSync) return
    crossStorage.set(storageKey, JSON.stringify(stateData))
  }, [stateData, storageKey, crossStorage, inSync])
}

function mergeStates(tmpState = {}, crossStorageData) {
  const csData = crossStorageData || {}
  const csReadContents = csData.readContents || {}
  let mergedReadContents = { ...csReadContents }
  Object.keys(tmpState.readContents).forEach((contentType) => {
    mergedReadContents[contentType] =
      (mergedReadContents[contentType] || 0) +
      (tmpState.readContents[contentType] || 0)
  })
  return {
    readingTime: (tmpState.readingTime || 0) + (csData.readingTime || 0),
    readContents: mergedReadContents,
  }
}

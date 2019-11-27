import { useState, useEffect, useMemo } from "react";
import { CrossStorageClient } from "cross-storage";

export default function useCrossStorageSync(stateData, setStateData, settings) {
  const { crossStorageUrl, storageKey } = settings;
  const [connected, setConnected] = useState(false);
  const [inSync, setInSync] = useState(false);

  // start CrossStorageClient
  const crossStorage = useMemo(() => {
    if (typeof window === "undefined") return;
    return typeof crossStorageUrl === "string" && crossStorageUrl
      ? new CrossStorageClient(crossStorageUrl)
      : null;
  }, [crossStorageUrl]);

  // connect client
  useEffect(() => {
    if (!crossStorage) return;
    crossStorage.onConnect().then(() => setConnected(true));
    return () => crossStorage.close();
  }, [crossStorage]);

  // crossStorage -> state (only once after connection)
  useEffect(() => {
    if (!crossStorage || !connected) return;
    crossStorage
      .get(storageKey)
      .then(JSON.parse)
      .then(crossStorageData => {
        setStateData(tmpState => mergeStates(tmpState, crossStorageData));
        setInSync(true);
      });
  }, [setStateData, connected, crossStorage, storageKey]);

  // state -> crossStorage
  useEffect(() => {
    if (!crossStorage || !inSync) return;
    crossStorage.set(storageKey, JSON.stringify(stateData));
  }, [stateData, storageKey, crossStorage, inSync]);
}

function mergeStates(tmpState, crossStorageData) {
  let mergedReadContents = { ...crossStorageData.readContents };
  Object.keys(tmpState.readContents).forEach(contentType => {
    mergedReadContents[contentType] =
      (mergedReadContents[contentType] || 0) +
      (tmpState.readContents[contentType] || 0);
  });
  return {
    readingTime: tmpState.readingTime + crossStorageData.readingTime,
    readContents: mergedReadContents
  };
}

import { useContext, useState, useEffect } from "react";
import { Settings } from "../contexts";

export default function useDomObserver() {
  const { domObserverEnabled, targetSelector } = useContext(Settings);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const update = () => setUpdateTrigger(c => c + 1);
  useEffect(() => {
    if (!domObserverEnabled) return;
    const observer = new MutationObserver(mutationHandler);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
      childList: true,
      subtree: true
    });
    function mutationHandler(mutations) {
      const shallUpdate = mutations
        .filter(m => m.addedNodes.length)
        .reduce((acc, m) => {
          return (
            Array.from(m.addedNodes)
              .filter(n => n.nodeType === 1)
              .reduce((acc2, n) => {
                return n.querySelector(targetSelector) || acc2;
              }, false) || acc
          );
        }, false);
      if (shallUpdate) {
        update();
        // console.log(shallUpdate);
      }
    }
    return () => observer.disconnect();
  }, [domObserverEnabled, targetSelector]);
  /*useEffect(() => {
    if (updateTrigger > 0)
      console.log("Relevant DOM mutations detected. Updating ...");
  }, [updateTrigger]);*/
  return updateTrigger;
}

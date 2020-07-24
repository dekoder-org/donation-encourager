import { useContext, useReducer, useEffect } from "react"
import { Settings } from "../contexts"

export default function useDomObserver() {
  const { domObserverEnabled, targetSelector } = useContext(Settings)
  const [updateTrigger, forceUpdate] = useReducer((x) => x + 1, 0)
  useEffect(() => {
    if (!domObserverEnabled) return
    const observer = new MutationObserver(mutationHandler)
    observer.observe(document.body, {
      // attributes: true,
      // attributeFilter: ["class"],
      childList: true,
      subtree: true,
    })
    function mutationHandler(mutations) {
      const shallUpdate = mutations
        // .filter(m => m.addedNodes.length)
        // .filter(m => m.target.matches(targetSelector))
        .reduce((acc, m) => {
          return (
            Array.from(m.addedNodes)
              .filter((n) => n.nodeType === 1)
              .reduce((acc2, n) => {
                // return n.querySelector(targetSelector) || acc2;
                return n.matches(targetSelector) || acc2
              }, false) || acc
          )
        }, false)
      if (shallUpdate) {
        forceUpdate()
        // console.log("force update");
      }
    }
    return () => observer.disconnect()
  }, [domObserverEnabled, targetSelector])
  /* useEffect(() => {
      console.log("Relevant DOM mutations detected. Updating ...");
  }, [updateTrigger]);*/
  return updateTrigger
}

import { useContext, useMemo } from "react"
import { Settings } from "../contexts"
import useDomObserver from "./dom-observer"

export default function useTargets(currentContent) {
  const updateTrigger = useDomObserver()
  const targetElements = useSelector(updateTrigger, currentContent)
  return targetElements
}

function useSelector(updateTrigger, currentContent) {
  const { targetSelector } = useContext(Settings)
  return useMemo(() => {
    if (typeof document === "undefined") return []
    ;[].push(updateTrigger)
    ;[].push(currentContent)
    return Array.from(document.querySelectorAll(targetSelector))
  }, [targetSelector, updateTrigger, currentContent])
}

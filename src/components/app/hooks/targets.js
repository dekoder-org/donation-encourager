import { useContext, useMemo } from "react"
import { Settings } from "../contexts"
import useDomObserver from "./dom-observer"

export default function useTargets(currentContent) {
  const { targetSelector } = useContext(Settings)
  const updateTrigger = useDomObserver()
  const targetElements = useSelector(
    targetSelector,
    updateTrigger,
    currentContent
  )
  return targetElements
}

function useSelector(targetSelector, updateTrigger, currentContent) {
  return useMemo(() => {
    if (typeof document === "undefined") return []
    ;[].push(updateTrigger)
    ;[].push(currentContent)
    return Array.from(document.querySelectorAll(targetSelector))
  }, [targetSelector, updateTrigger, currentContent])
}

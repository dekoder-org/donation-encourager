import { useContext, useEffect, useRef } from "react"
import { Settings, Storage } from "../contexts"

const THRESHOLD_TIME = 3000 // minimum ms between two updates to be counted

export default function useContentTracker(currentContent) {
  const { trackerEnabled } = useContext(Settings)
  const { addReadContent } = useContext(Storage)
  const previousContent = usePrevious(currentContent, trackerEnabled) || {}
  const prevTs = previousContent.ts || 0
  useEffect(() => {
    if (!trackerEnabled) return
    if (currentContent.ts - prevTs >= THRESHOLD_TIME) {
      addReadContent(currentContent.type)
    }
  }, [currentContent, trackerEnabled, addReadContent, prevTs])
}

function usePrevious(value, enabled = true) {
  const ref = useRef()
  useEffect(() => {
    if (enabled) ref.current = value
  }, [value, enabled])
  return ref.current
}

import { useContext, useState, useEffect, useMemo } from "react"
import { Settings } from "../contexts"
import { getChildArray } from "./box-positioner"
import "./content-lock.scss"

const BLUR_CLASS = "donation-encourager__lock-content"
const BLUR_CLASS_ACTIVE = "content-lock-active"

// gives gradient to last content block before 1st donation encourager box
// + blur for all following content blocks
export default function useContentLock({ contentLockEnabled }, targets, boxes) {
  const { boxesEnabled, wrapperClass } = useContext(Settings)
  const isInitiallyActive = contentLockEnabled && boxesEnabled
  const [contentLockActive, setContentLockActive] = useState(isInitiallyActive)
  useEffect(() => setContentLockActive(isInitiallyActive), [isInitiallyActive])
  const unlockContent = () => setContentLockActive(false)

  const blurEls = useChildReducer(targets, wrapperClass, blurElGetter, boxes)
  useClass(blurEls, true, BLUR_CLASS)
  useClass(blurEls, contentLockActive, BLUR_CLASS_ACTIVE)

  return [contentLockActive, unlockContent]
}

function useClass(elements, active, className) {
  useEffect(() => {
    elements.forEach((el) => (active ? el.classList.add(className) : ""))
    return () => {
      elements.forEach((el) => el.classList.remove(className))
    }
  }, [elements, active, className])
}

function blurElGetter(acc, allChildren, firstBoxIndex, wrapperClass) {
  const childrenAfterFirstBox = allChildren
    .slice(firstBoxIndex)
    .filter((el) => !el.classList.contains(wrapperClass))
  return [...acc, ...childrenAfterFirstBox]
}

function useChildReducer(targetElements, wrapperClass, reducer, trigger) {
  return useMemo(() => {
    ;[].push(trigger)
    return targetElements.reduce((acc, targetElement) => {
      const allChildren = getChildArray(targetElement)
      const firstBox = allChildren.find((c) =>
        c.classList.contains(wrapperClass)
      )
      const firstBoxIndex = allChildren.indexOf(firstBox)
      return reducer(acc, allChildren, firstBoxIndex, wrapperClass)
    }, [])
  }, [targetElements, wrapperClass, reducer, trigger])
}

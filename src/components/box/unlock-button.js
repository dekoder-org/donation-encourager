import React, { useContext } from "react"
import { Settings } from "../app/contexts"
import { useHookedFunc } from "./helpers"

const UnlockButton = ({ onClick }) => {
  const { strings, classNames } = useContext(Settings)
  const onUnlockBtnClick = useHookedFunc("onUnlockBtnClick", onClick)
  return (
    <a
      className={`${classNames.button} ${classNames.unlockButton}`}
      onClick={onUnlockBtnClick}
    >
      {strings.unlockBtn}
    </a>
  )
}

function useUnlockButton(contentLockProps, setIsExpanded) {
  const [contentLockActive, unlockContent] = contentLockProps
  const comp = contentLockActive && (
    <UnlockButton
      onClick={() => {
        setIsExpanded(false)
        unlockContent()
      }}
    />
  )
  return comp
}

export default useUnlockButton

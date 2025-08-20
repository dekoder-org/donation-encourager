import React, { useContext } from "react"
import { Settings } from "../app/contexts"
import { useHookedFunc } from "../box/helpers"

const BackButton = ({ onClick }) => {
  const { strings, classNames } = useContext(Settings)
  const onBackBtnClick = useHookedFunc("onBackBtnClick", onClick)
  return (
    <p className={classNames.meta}>
      <small>
        <button className={classNames.resetBtn} onClick={onBackBtnClick}>
          {strings.backBtn}
        </button>
      </small>
    </p>
  )
}

export default BackButton

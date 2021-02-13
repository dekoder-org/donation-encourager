import React, { useContext } from "react"
import { Settings } from "../app/contexts"
import { useHookedFunc } from "../box/helpers"

const BackButton = ({ onClick }) => {
  const { strings } = useContext(Settings)
  const onBackBtnClick = useHookedFunc("onBackBtnClick", onClick)
  return (
    <p className="donation-encourager__meta">
      <small>
        <button
          className="donation-encourager__reset-btn"
          onClick={onBackBtnClick}
        >
          {strings.backBtn}
        </button>
      </small>
    </p>
  )
}

export default BackButton

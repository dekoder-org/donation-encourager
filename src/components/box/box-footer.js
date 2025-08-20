import React, { useContext } from "react"
import { Settings, Storage } from "../app/contexts"
import { useStrOrStateFunc, useHookedFunc } from "./helpers"

export default function BoxFooter() {
  const { reset } = useContext(Storage)
  const { strings, classNames } = useContext(Settings)
  const footerStr = useStrOrStateFunc(strings.footer)
  const onResetBtnClick = useHookedFunc("onResetBtnClick", reset)
  return (
    <p className={classNames.meta}>
      <small>
        {footerStr}{" "}
        <button className={classNames.resetBtn} onClick={onResetBtnClick}>
          {strings.resetBtn}
        </button>
      </small>
    </p>
  )
}

import React, { useContext } from "react"
import { Settings } from "../app/contexts"
import { Amount } from "./contexts"
import { useStrOrStateFunc, useHookedFunc } from "./helpers"

export default function BoxCtaButton({ onClick, isInactive = false }) {
  const { strings } = useContext(Settings)
  const amount = useContext(Amount)
  const buttonString = useStrOrStateFunc(strings.ctaBtn)
  const onCtaBtnClick = useHookedFunc("onCtaBtnClick", onClick)
  return (
    <button
      className={`donation-encourager__button donation-encourager__cta-button${
        !amount.val || isInactive ? " inactive" : " active"
      }`}
      onClick={onCtaBtnClick}
      dangerouslySetInnerHTML={{ __html: buttonString }}
    />
  )
}

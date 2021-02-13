import React, { useState } from "react"
import useItemSelector from "../item-selector"
import { Amount } from "./contexts"
import BoxLead from "./box-lead"
import BoxBody from "./box-body"
import BoxCtaButton from "./box-cta-button"
import BoxFooter from "./box-footer"
import BoxCredit from "./box-credit"
import useUnlockButton from "./unlock-button"
import "./box.scss"
import "./box-dekoder.scss"
import useMonthlyCheckbox from "./box-monthly-check"
import usePay from "../payment"
import CollapseMe from "./collapse-me"

const Box = ({ boxProps, contentLockProps, isFeedbackShown }) => {
  const [isExpanded, setIsExpanded] = useState(boxProps.expanded)
  const toggleExpanded = () => setIsExpanded((e) => !e) 
  const [itemSelector, amount] = useItemSelector(boxProps)
  const [monthlyCheckbox, isMonthly] = useMonthlyCheckbox(boxProps.key)
  const [paypalBtn, twingleWidget, onCtaClick] = usePay(amount, isFeedbackShown)
  const unlockButton = useUnlockButton(contentLockProps, setIsExpanded)
  let stateClasses = `${isExpanded ? "expanded" : "collapsed"}`
  stateClasses += `${contentLockProps[0] ? " content-lock-active" : ""}`
  return (
    <Amount.Provider value={{ ...amount, isMonthly }}>
      <div className={`donation-encourager__gradient ${stateClasses}`} />
      <aside className={`donation-encourager ${stateClasses}`}>
        {twingleWidget || (
          <>
            <BoxLead onClick={toggleExpand} isExpanded={isExpanded} />
            <CollapseMe isExpanded={isExpanded}>
              <BoxBody />
              {itemSelector}
              {monthlyCheckbox}
              <p className="donation-encourager__cta">
                <BoxCtaButton onClick={onCtaClick} isInactive={!!paypalBtn} />
                {unlockButton}
              </p>
              {paypalBtn}
              <BoxFooter />
              <BoxCredit />
            </CollapseMe>
          </>
        )}
      </aside>
    </Amount.Provider>
  )
}

export default Box

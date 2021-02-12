import React, { useState } from "react"
import useTwingle from "../twingle-widget"
import useItemSelector from "../item-selector"
import { Amount } from "./contexts"
import BoxLead from "./box-lead"
import BoxBody from "./box-body"
import BoxCtaButton from "./box-cta-button"
import BoxFooter from "./box-footer"
import BoxCredit from "./box-credit"
import UnlockButton from "./unlock-button"
import "./box.scss"
import "./box-dekoder.scss"
import MonthlyCheckbox from "./box-monthly-check"
import usePayMethSelect from "../pay-meth-select"

const Box = ({ boxProps, contentLockProps, isFeedbackShown }) => {
  const [isExpanded, setIsExpanded] = useState(boxProps.expanded)
  const [itemSelector, amount] = useItemSelector(boxProps)
  const [isMonthly, setIsMonthly] = useState(false)
  const [twingleWidget, startTwingle] = useTwingle(amount, isFeedbackShown, isMonthly)
  const [payMethSelect, onCtaBtnClick] = usePayMethSelect({ isFeedbackShown, isMonthly, startTwingle })
  const [contentLockActive, unlockContent] = contentLockProps
  const stateClasses = contentLockActive ? " content-lock-active" : ""
  return (
    <Amount.Provider value={amount}>
      <div className={`donation-encourager__gradient${stateClasses}`} />
      <aside className={`donation-encourager${stateClasses}`}>
        {payMethSelect || twingleWidget || (
          <>
            <BoxLead
              onClick={() => setIsExpanded(!isExpanded)}
              isExpanded={isExpanded}
            />
            <CollapseMe isExpanded={isExpanded}>
              <BoxBody />
              {itemSelector}
              <MonthlyCheckbox checked={isMonthly} onClick={setIsMonthly} />
              <p className="donation-encourager__cta">
                <BoxCtaButton onClick={onCtaBtnClick} />
                {contentLockActive && (
                  <UnlockButton
                    onClick={() => {
                      setIsExpanded(false)
                      unlockContent()
                    }}
                  />
                )}
              </p>
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

function CollapseMe({ isExpanded, children }) {
  return (
    <div className="donation-encourager__collapse-me" hidden={!isExpanded}>
      {children}
    </div>
  )
}

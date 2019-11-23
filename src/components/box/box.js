import React, { useState } from "react";
import useTwingle from "../twingle-widget";
import useItemSelector from "../item-selector";
import { Amount } from "./contexts";
import BoxLead from "./box-lead";
import BoxBody from "./box-body";
import BoxCtaButton from "./box-cta-button";
import BoxFooter from "./box-footer";
import BoxCredit from "./box-credit";
import "./box.scss";
import "./box-dekoder.scss";
import UnlockButton from "./unlock-button";

const Box = ({ boxProps, contentLockProps, isFeedbackShown }) => {
  const [isExpanded, setIsExpanded] = useState(boxProps.expanded);
  const [itemSelector, amount] = useItemSelector(boxProps);
  const [twingleWidget, onCtaBtnClick] = useTwingle(amount, isFeedbackShown);
  const [contentLockActive, unlockContent] = contentLockProps;
  return (
    <Amount.Provider value={amount}>
      <aside className="donation-encourager">
        {twingleWidget || (
          <>
            <BoxLead
              onClick={() => setIsExpanded(!isExpanded)}
              isExpanded={isExpanded}
            />
            <CollapseMe isExpanded={isExpanded}>
              <BoxBody />
              {itemSelector}
              <p className="donation-encourager__cta">
                <BoxCtaButton onClick={onCtaBtnClick} />
                {contentLockActive && (
                  <UnlockButton
                    onClick={() => {
                      unlockContent();
                      setIsExpanded(false);
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
  );
};

export default Box;

function CollapseMe({ isExpanded, children }) {
  return (
    <div className="donation-encourager__collapse-me" hidden={!isExpanded}>
      {children}
    </div>
  );
}

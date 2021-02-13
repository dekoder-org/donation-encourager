import React from "react"

const CollapseMe = ({ isExpanded, children }) => (
  <div className="donation-encourager__collapse-me" hidden={!isExpanded}>
    {children}
  </div>
)

export default CollapseMe

import React, { useContext } from "react"
import { Settings } from "../app/contexts"

const CollapseMe = ({ isExpanded, children }) => {
  const { classNames } = useContext(Settings)
  return (
    <div className={classNames.collapseMe} hidden={!isExpanded}>
      {children}
    </div>
  )
}

export default CollapseMe

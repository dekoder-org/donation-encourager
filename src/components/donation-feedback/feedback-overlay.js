import React, { useContext } from "react"
import "./feedback-overlay.scss"
import { Settings } from "../app/contexts"

const FeedbackOverlay = ({ children, onClick }) => {
  const { classNames } = useContext(Settings)
  return (
    <div className={classNames.feedbackOverlay} onClick={onClick}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

export default FeedbackOverlay

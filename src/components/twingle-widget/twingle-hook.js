import React, { useEffect, useContext, useState } from "react"
import { Settings } from "../app/contexts"
import TwingleWidget from "./twingle-widget"

export default function useTwingle(amount, isFeedbackShown, isMonthly) {
  const { twingleWidgetUrl } = useContext(Settings)
  const [widgetExpanded, setWidgetExpanded] = useState(false)
  const onCtaBtnClick = twingleWidgetUrl
    ? (e) => {
        if (e) e.preventDefault()
        setWidgetExpanded(true)
      }
    : null
  const twingleWidget = twingleWidgetUrl && widgetExpanded && (
    <TwingleWidget
      amount={amount.val}
      exit={() => setWidgetExpanded(false)}
      widgetUrl={twingleWidgetUrl}
      isMonthly={isMonthly}
    />
  )
  useEffect(() => setWidgetExpanded(false), [isFeedbackShown])
  return [twingleWidget, onCtaBtnClick]
}

import React, { useEffect, useContext, useState } from "react";
import { Settings } from "../app/contexts";
import TwingleWidget from "./twingle-widget";

export default function useTwingle(totalVal, isFeedbackShown) {
  const { twingleWidgetUrl } = useContext(Settings);
  const [widgetExpanded, setWidgetExpanded] = useState(false);
  const onCtaBtnClick = twingleWidgetUrl
    ? e => {
        e.preventDefault();
        setWidgetExpanded(true);
      }
    : "";
  const twingleWidget = twingleWidgetUrl && widgetExpanded && (
    <TwingleWidget
      amount={totalVal}
      exit={() => setWidgetExpanded(false)}
      twingleWidgetUrl={twingleWidgetUrl}
    />
  );
  useEffect(() => setWidgetExpanded(false), [isFeedbackShown]);
  return [twingleWidget, onCtaBtnClick];
}

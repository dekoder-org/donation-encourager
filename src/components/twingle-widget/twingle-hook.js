import React, { useEffect, useContext, useState } from "react";
import { Settings } from "../app/contexts";
import TwingleWidget from "./twingle-widget";

export default function useTwingle(amount, isFeedbackShown) {
  const { twingleWidgetUrl, strings } = useContext(Settings);
  const [widgetExpanded, setWidgetExpanded] = useState(false);
  const onCtaBtnClick = twingleWidgetUrl
    ? e => {
        e.preventDefault();
        setWidgetExpanded(true);
      }
    : null;
  const twingleWidget = twingleWidgetUrl && widgetExpanded && (
    <TwingleWidget
      amount={amount.val}
      exit={() => setWidgetExpanded(false)}
      widgetUrl={twingleWidgetUrl}
      backStr={strings.backBtn}
    />
  );
  useEffect(() => setWidgetExpanded(false), [isFeedbackShown]);
  return [twingleWidget, onCtaBtnClick];
}

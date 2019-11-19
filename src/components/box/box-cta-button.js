import React, { useContext } from "react";
import { Settings } from "../app/contexts";
import { Amount } from "./contexts";
import { strOrFunc, useStrOrStateFunc } from "./helpers";

export default function BoxCtaButton({ onClick }) {
  const { ctaTargetUrl, strings } = useContext(Settings);
  const amount = useContext(Amount);
  const targetUrl = strOrFunc(ctaTargetUrl, [amount.val]);
  const buttonString = useStrOrStateFunc(strings.ctaBtn);
  return (
    <a
      className={`donation-encourager__button donation-encourager__cta-button${
        !amount.val ? " inactive" : ""
      }`}
      href={onClick ? "#" : targetUrl}
      target="_blank"
      rel="norel noreferrer"
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: buttonString }}
    />
  );
}

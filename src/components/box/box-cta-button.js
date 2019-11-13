import React, { useContext } from "react";
import { Settings } from "../app/contexts";
import { TotalVal } from "./contexts";
import { strOrFunc, useStrOrStateFunc } from "./helpers";

export default function BoxCtaButton({ onClick }) {
  const { ctaTargetUrl, strings } = useContext(Settings);
  const totalVal = useContext(TotalVal);
  const targetUrl = strOrFunc(ctaTargetUrl, [totalVal]);
  const buttonString = useStrOrStateFunc(strings.ctaBtn);
  return (
    <a
      className={`donation-encourager__button donation-encourager__cta-button${
        !totalVal ? " inactive" : ""
      }`}
      href={onClick ? "#" : targetUrl}
      target="_blank"
      rel="norel noreferrer"
      onClick={onClick}
    >
      {buttonString}
    </a>
  );
}

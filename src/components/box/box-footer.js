import React, { useContext } from "react";
import { Settings, Storage } from "../app/contexts";
import { useStrOrStateFunc } from "./helpers";

export default function BoxFooter() {
  const { reset } = useContext(Storage);
  const { strings } = useContext(Settings);
  const footerStr = useStrOrStateFunc(strings.footer);
  return (
    <p className="donation-encourager__meta">
      <small>
        {footerStr}{" "}
        <button className="donation-encourager__reset-btn" onClick={reset}>
          {strings.resetBtn}
        </button>
      </small>
    </p>
  );
}

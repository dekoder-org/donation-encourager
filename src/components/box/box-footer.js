import React, { useContext } from "react";
import { Settings, Storage } from "../app/contexts";
import { useStrOrStateFunc } from "./helpers";

export default function BoxFooter() {
  const { reset } = useContext(Storage);
  const { strings, hooks } = useContext(Settings);
  const footerStr = useStrOrStateFunc(strings.footer);
  const onResetBtnClick =
    typeof hooks.onResetBtnClick === "function"
      ? () => hooks.onResetBtnClick(reset)
      : reset;
  return (
    <p className="donation-encourager__meta">
      <small>
        {footerStr}{" "}
        <button
          className="donation-encourager__reset-btn"
          onClick={onResetBtnClick}
        >
          {strings.resetBtn}
        </button>
      </small>
    </p>
  );
}

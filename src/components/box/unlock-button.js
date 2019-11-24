import React, { useContext } from "react";
import { Settings } from "../app/contexts";
import { useHookedFunc } from "./helpers";

const UnlockButton = ({ onClick }) => {
  const { strings } = useContext(Settings);
  const onUnlockBtnClick = useHookedFunc("onUnlockBtnClick", onClick);
  return (
    <a
      className="donation-encourager__button donation-encourager__unlock-button"
      onClick={onUnlockBtnClick}
    >
      {strings.unlockBtn}
    </a>
  );
};

export default UnlockButton;

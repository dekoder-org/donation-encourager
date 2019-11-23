import React, { useContext } from "react";
import { Settings } from "../app/contexts";

const UnlockButton = ({ onClick }) => {
  const { strings } = useContext(Settings);
  return (
    <a
      className="donation-encourager__button donation-encourager__unlock-button"
      onClick={onClick}
    >
      {strings.unlockBtn}
    </a>
  );
};

export default UnlockButton;

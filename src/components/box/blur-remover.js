import React, { useContext } from "react";
import { Settings } from "../app/contexts";

const BlurRemover = ({ onClick }) => {
  const { strings } = useContext(Settings);
  return (
    <a
      className="donation-encourager__button donation-encourager__blur-remover"
      onClick={onClick}
    >
      {strings.blurRemover}
    </a>
  );
};

export default BlurRemover;

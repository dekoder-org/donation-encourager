import React, { useContext } from "react";
import Counter from "../counter";
import { Settings, Storage } from "../app/contexts";
import { strOrFunc } from "./helpers";

export default function BoxLead({ onClick, isExpanded }) {
  const { totalContents } = useContext(Storage);
  const { strings } = useContext(Settings);
  const leadStr = strOrFunc(strings.lead, [totalContents]);
  return (
    <div className="donation-encourager__lead experimental" onClick={onClick}>
      <h2 className="donation-encourager__headline">
        <Counter value={totalContents}></Counter>
        {/*type === "experimental" && ` = ${icon} ?`*/}
      </h2>
      <p className="donation-encourager__lead-text">
        <small>
          {leadStr}
          {isExpanded ? " ↑" : " ↓"}
        </small>
      </p>
    </div>
  );
}

/*
        <button
          className="donation-encourager__collapser"
          onClick={onClick}
          aria-expanded={isExpanded}
        >
          <small>
            {isExpanded ? "Weniger Informationen ↑" : "Mehr Informationen ↓"}
          </small>
        </button>
*/

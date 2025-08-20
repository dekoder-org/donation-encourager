import React, { useContext } from "react"
import Counter from "../counter"
import { Settings, Storage } from "../app/contexts"
import { strOrFunc } from "./helpers"

export default function BoxLead({ onClick, isExpanded }) {
  const { totalContents } = useContext(Storage)
  const { strings, classNames } = useContext(Settings)
  const leadStr = strOrFunc(strings.lead, [totalContents])
  return (
    <div className={classNames.lead} onClick={onClick}>
      <h2 className={classNames.headline}>
        <Counter value={totalContents}></Counter>
      </h2>
      <p className={classNames.leadText}>
        <small>
          {leadStr}
          {isExpanded ? " ↑" : " ↓"}
        </small>
      </p>
    </div>
  )
}

import React, { useContext } from "react"
import { Settings } from "../app/contexts"

const BoxCredit = () => {
  const { strings } = useContext(Settings)
  return (
    <div className="donation-encourager__credit">
      <small>
        <small dangerouslySetInnerHTML={{ __html: strings.credit }} />
      </small>
    </div>
  )
}

export default BoxCredit

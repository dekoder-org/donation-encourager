import React, { useContext } from "react"
import { Settings } from "../app/contexts"

const BoxCredit = () => {
  const { strings, classNames } = useContext(Settings)
  return (
    <div className={classNames.credit}>
      <small>
        <small dangerouslySetInnerHTML={{ __html: strings.credit }} />
      </small>
    </div>
  )
}

export default BoxCredit

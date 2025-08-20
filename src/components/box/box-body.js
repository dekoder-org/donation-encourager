import React, { useContext } from "react"
import { Settings } from "../app/contexts"
import { useStrOrStateFunc } from "./helpers"

const BoxBody = () => {
  const { strings, classNames } = useContext(Settings)
  const bodyString = useStrOrStateFunc(strings.body)
  return (
    <p
      className={classNames.body}
      dangerouslySetInnerHTML={{ __html: bodyString }}
    />
  )
}

export default BoxBody

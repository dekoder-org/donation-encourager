import React, { useContext } from "react"
import { Settings } from "../app/contexts"
import { useStrOrStateFunc } from "./helpers"

const BoxBody = () => {
  const { strings } = useContext(Settings)
  const bodyString = useStrOrStateFunc(strings.body)
  return (
    <p
      className="donation-encourager__body"
      dangerouslySetInnerHTML={{ __html: bodyString }}
    />
  )
}

export default BoxBody

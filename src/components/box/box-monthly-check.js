import React, { useContext } from "react"
import { Settings } from "../app/contexts"

const MonthlyCheckbox = ({ checked = false, onClick }) => {
  const { strings } = useContext(Settings)
  return (
    <p style={{ textAlign: "center" }}>
      {strings.monthly}
      <input
        type="checkbox"
        checked={checked}
        onClick={(e) => onClick(e.target.checked)}
        style={{ marginLeft: ".5em" }}
      />
    </p>
  )
}

export default MonthlyCheckbox

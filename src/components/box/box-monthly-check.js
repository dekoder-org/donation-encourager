import React, { useState, useContext } from "react"
import { Settings } from "../app/contexts"
import "./box-monthly-check.scss"

const MonthlyCheckbox = ({ id, checked = false, onClick }) => {
  const { strings } = useContext(Settings)
  const inputId = `donation-encourager__monthly-check_switch-${id}`
  return (
    <p class="donation-encourager__monthly-check">
      <span>{strings.monthly}</span>
      <span class="switch">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onClick={(e) => onClick(e.target.checked)}
        />
        <label for={inputId} class="donation-encourager__monthly-check-label">
          Switch
        </label>
      </span>
    </p>
  )
}

function useMonthlyCheckbox(id) {
  const [isMonthly, setIsMonthly] = useState(false)
  const comp = (
    <MonthlyCheckbox
      id={id}
      checked={isMonthly}
      onClick={() => setIsMonthly((m) => !m)}
    />
  )
  return [comp, isMonthly]
}

export default useMonthlyCheckbox

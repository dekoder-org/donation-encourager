import { useContext } from "react"
import { Storage, Settings } from "../app/contexts"
import { Amount } from "./contexts"

// if input is a string, just return the string. if it is a function, pass some state variables into it ...
export function useStrOrStateFunc(input) {
  const storage = useContext(Storage)
  const { readingTimeString, readContentsString } = storage
  const amount = useContext(Amount)
  return strOrFunc(input, [
    readingTimeString,
    readContentsString,
    amount.str,
    storage,
    amount.isMonthly,
  ])
}

export function strOrFunc(input, argumentArr = []) {
  return typeof input === "function" ? input(...argumentArr) : input
}

export function useHookedFunc(hookName, defaultFunc, extraArgs) {
  const { hooks } = useContext(Settings)
  return typeof hooks[hookName] === "function" &&
    typeof defaultFunc === "function"
    ? (ev) => {
        const customHookReturn = hooks[hookName](defaultFunc, extraArgs)
        if (customHookReturn !== false) defaultFunc(ev)
      }
    : defaultFunc
}

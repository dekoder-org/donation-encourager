import { useContext } from "react";
import { Storage, Settings } from "../app/contexts";
import { TotalVal } from "./contexts";

// if input is a string, just return the string. if it is a function, pass some state variables into it ...
export function useStrOrStateFunc(input) {
  const { locale } = useContext(Settings);
  const storage = useContext(Storage);
  const { readingTimeString, readContentsString } = storage;
  const totalVal = useContext(TotalVal);
  const moneyString = getMoneyString(totalVal, locale);
  return strOrFunc(input, [
    readingTimeString,
    readContentsString,
    moneyString,
    storage
  ]);
}

export function strOrFunc(input, argumentArr = []) {
  return typeof input === "function" ? input(...argumentArr) : input;
}

export function getMoneyString(amount, locale) {
  return amount.toLocaleString(locale, {
    minimumFractionDigits: amount % 1 ? 2 : 0
  });
}

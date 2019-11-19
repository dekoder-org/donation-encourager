import { useContext } from "react";
import { Storage } from "../app/contexts";
import { Amount } from "./contexts";

// if input is a string, just return the string. if it is a function, pass some state variables into it ...
export function useStrOrStateFunc(input) {
  const storage = useContext(Storage);
  const { readingTimeString, readContentsString } = storage;
  const amount = useContext(Amount);
  return strOrFunc(input, [
    readingTimeString,
    readContentsString,
    amount.str,
    storage
  ]);
}

export function strOrFunc(input, argumentArr = []) {
  return typeof input === "function" ? input(...argumentArr) : input;
}

import { useContext, useMemo } from "react";
import { Settings } from "../contexts";
import useDomObserver from "./dom-observer";

export default function useTargets() {
  const { targetSelector } = useContext(Settings);
  const updateTrigger = useDomObserver();
  const targetElements = useSelector(targetSelector, updateTrigger);
  return targetElements;
}

function useSelector(targetSelector, updateTrigger) {
  return useMemo(() => {
    [].push(updateTrigger);
    return Array.from(document.querySelectorAll(targetSelector));
  }, [targetSelector, updateTrigger]);
}

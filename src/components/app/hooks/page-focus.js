import { useState, useEffect } from "react";
import { handleListeners } from "./time-tracker";

export default function usePageFocus(trackerEnabled) {
  const [pageFocussed, setPageFocussed] = useState(true);
  useEffect(() => {
    if (!trackerEnabled) return;
    const userLeft = () => setPageFocussed(false);
    const userReturned = () => setPageFocussed(true);
    const onVisibChange = () => (document.hidden ? userLeft() : userReturned());
    const pageFocusEvents = [
      [document, "visibilitychange", onVisibChange],
      [window, "blur", userLeft],
      [window, "focus", userReturned]
    ];
    handleListeners("add", pageFocusEvents);
    return () => handleListeners("remove", pageFocusEvents);
  }, [trackerEnabled]);
  return pageFocussed;
}
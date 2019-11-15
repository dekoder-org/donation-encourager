import { useState, useContext, useEffect } from "react";
import { Settings } from "../contexts";

export default function useDonationListener() {
  const { donationListenerEnabled } = useContext(Settings);
  const [isFeedbackShown, setIsFeedbackShown] = useState(false);
  useEffect(() => {
    if (!donationListenerEnabled) return;
    const handlePostMessage = ev => {
      if (ev.data && ev.data.type === "donationFinished") {
        // console.log("Donation registered ...");
        setIsFeedbackShown(true);
      }
    };
    window.addEventListener("message", handlePostMessage, false);
    return () => window.removeEventListener("message", handlePostMessage);
  }, [donationListenerEnabled]);
  return [isFeedbackShown, () => setIsFeedbackShown(false)];
}

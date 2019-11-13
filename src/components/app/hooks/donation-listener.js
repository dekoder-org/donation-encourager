import { useState, useContext, useEffect } from "react";
import { Settings, Storage } from "../contexts";

export default function useDonationListener() {
  const { donationListenerEnabled } = useContext(Settings);
  const { reset } = useContext(Storage);
  const [isFeedbackShown, setIsFeedbackShown] = useState(false);
  const showFeedback = () => setIsFeedbackShown(true);
  const hideFeedback = () => {
    setIsFeedbackShown(false);
    reset();
  };
  const handlePostMessage = ev => {
    if (ev.data && ev.data.type === "donationFinished") {
      // console.log("Donation registered. Resetting donation encourager ...");
      // if (typeof reset === "function") reset();
      showFeedback();
    }
  };
  useEffect(() => {
    if (!donationListenerEnabled) return;
    window.addEventListener("message", handlePostMessage, false);
    return () => window.removeEventListener("message", handlePostMessage);
  }, [donationListenerEnabled]);
  return [isFeedbackShown, hideFeedback];
  // return isFeedbackShown && <DonationFeedback destroy={hideFeedback} />;
}

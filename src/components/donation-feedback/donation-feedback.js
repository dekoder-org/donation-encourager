import React, { useContext, useCallback, useEffect } from "react";
import { Portal } from "react-portal";
import { Settings, Storage } from "../app/contexts";
import BackgroundSunglasses from "./background-sunglasses";
import "./donation-feedback.scss";
import "../box/box.scss";

const FEEDBACK_DESTROY_DELAY = 15000; // in ms

export default function DonationFeedback({ hideFeedback }) {
  const { strings } = useContext(Settings);
  const { reset } = useContext(Storage);
  const destroy = useCallback(() => {
    hideFeedback();
    reset();
  }, [hideFeedback, reset]);
  // in case the user forgets to click: destroy & reset after a while automatically
  useCallbackDelay(destroy, FEEDBACK_DESTROY_DELAY);
  return (
    <Portal node={document.body}>
      <BackgroundSunglasses onClick={destroy}>
        <div className="donation-encourager__feedback">
          <h3>{strings.feedbackTitle}</h3>
          <p>{strings.feedbackBody}</p>
          <p className="donation-encourager__cta">
            <a
              className="donation-encourager__button donation-encourager__cta-button"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                destroy();
              }}
            >
              {strings.feedbackBtn}
            </a>
          </p>
        </div>
      </BackgroundSunglasses>
    </Portal>
  );
}

function useCallbackDelay(callback, delay) {
  useEffect(() => {
    setTimeout(callback, delay);
  }, [callback, delay]);
}

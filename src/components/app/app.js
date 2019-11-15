import React, { useState } from "react";
import { Portal } from "react-portal";

import { SETTINGS_DEFAULT_DISABLED } from "./settings-default";
import { Settings, Storage } from "./contexts";
import useStorage from "./hooks/storage";
import useSiteActions from "./hooks/site-actions";

import useContentTracker from "./hooks/content-tracker";
import useTimeTracker from "./hooks/time-tracker";
import useDonationListener from "./hooks/donation-listener";
import useDomObserver from "./hooks/dom-observer";
import useIntrusiveness from "./hooks/intrusiveness";
import useBoxPositioner from "./hooks/box-positioner";
import useBlur from "./hooks/blur";

import Box from "../box";
import DonationFeedback from "../donation-feedback";

function App({ currentContent }) {
  useContentTracker(currentContent);
  useTimeTracker();
  const [isFeedbackShown, hideFeedback] = useDonationListener();
  const intrusivenessProps = useIntrusiveness();
  const updateTrigger = useDomObserver();
  const boxes = useBoxPositioner(intrusivenessProps, updateTrigger);
  const blurProps = useBlur(intrusivenessProps, updateTrigger);
  const [blurActive] = blurProps;
  return (
    <>
      {boxes
        .filter(boxProps => (blurActive ? boxProps.isFirst : true))
        .map((boxProps, i) => (
          <Portal node={boxProps.wrapperEl} key={i}>
            <Box {...{ boxProps, blurProps, isFeedbackShown }} />
          </Portal>
        ))}
      {isFeedbackShown && <DonationFeedback hideFeedback={hideFeedback} />}
    </>
  );
}

function AppController() {
  const [settings, setSettings] = useState(SETTINGS_DEFAULT_DISABLED);
  const storage = useStorage(settings);
  const currentContent = useSiteActions(setSettings, storage);
  return (
    <Settings.Provider value={settings}>
      <Storage.Provider value={storage}>
        <App currentContent={currentContent} />
      </Storage.Provider>
    </Settings.Provider>
  );
}

export default AppController;

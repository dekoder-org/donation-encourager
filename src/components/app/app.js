import React, { useState } from "react";
import { Portal } from "react-portal";

import { SETTINGS_DEFAULT_DISABLED } from "./settings-default";
import { Settings, Storage } from "./contexts";
import useStorage from "./hooks/storage";
import useSiteActions from "./hooks/site-actions";

import useContentTracker from "./hooks/content-tracker";
import useTimeTracker from "./hooks/time-tracker";
import useDonationListener from "./hooks/donation-listener";
import useIntrusiveness from "./hooks/intrusiveness";
import useTargets from "./hooks/targets";
import useBoxPositioner from "./hooks/box-positioner";
import useContentLock from "./hooks/content-lock";

import Box from "../box";
import DonationFeedback from "../donation-feedback";
import usePageFocus from "./hooks/page-focus";

function App({ currentContent, pageFocussed }) {
  useContentTracker(currentContent);
  useTimeTracker(pageFocussed);
  const [isFeedbackShown, hideFeedback] = useDonationListener();
  const intrusivenessProps = useIntrusiveness();
  const targets = useTargets(currentContent);
  const boxes = useBoxPositioner(intrusivenessProps, targets);
  const contentLockProps = useContentLock(intrusivenessProps, targets, boxes);
  const [contentLockActive] = contentLockProps;
  return (
    <>
      {boxes
        .filter((boxProps) => (contentLockActive ? boxProps.isFirst : true))
        .map((boxProps) => (
          <Portal node={boxProps.wrapperEl} key={boxProps.key}>
            <Box {...{ boxProps, contentLockProps, isFeedbackShown }} />
          </Portal>
        ))}
      {isFeedbackShown && <DonationFeedback hideFeedback={hideFeedback} />}
    </>
  );
}

function AppController() {
  const [settings, setSettings] = useState(SETTINGS_DEFAULT_DISABLED);
  const pageFocussed = usePageFocus(settings.trackerEnabled);
  const storage = useStorage(settings, pageFocussed);
  const currentContent = useSiteActions(setSettings, storage);
  return (
    <Settings.Provider value={settings}>
      <Storage.Provider value={storage}>
        <App currentContent={currentContent} pageFocussed={pageFocussed} />
      </Storage.Provider>
    </Settings.Provider>
  );
}

export default AppController;

import { useState, useEffect } from "react";
import {
  CONTENT_TYPE_DEFAULT,
  SETTINGS_DEFAULT,
  SETTINGS_DISABLE_ALL,
  SETTINGS_ENABLE_ALL,
  mergeInNewSettings,
  itemPresets
} from "../settings-default";

export default function useActions(setSettings, { reset, setReadContents }) {
  const [currentContent, setCurrentContent] = useState({});
  const sendPageView = contentType => {
    setCurrentContent({ ts: ts(), type: contentType || CONTENT_TYPE_DEFAULT });
  };

  useEffect(() => {
    const funcs = { setSettings, sendPageView, reset, setReadContents };
    const actionHandler = a => handleAction(a, funcs);
    handleExistingActions(actionHandler);
    startActionListener(actionHandler);
    return () => {};
  }, [setSettings, reset, setReadContents]);

  return currentContent;
}

function handleAction(action, funcs) {
  const { setSettings, sendPageView, reset, setReadContents } = funcs;
  if (!action) return;
  const [actionTypeRaw, actionData] = Array.from(action);
  const actionType = (actionTypeRaw || "").toLowerCase();
  if (actionType === "init") {
    setSettings(mergeInNewSettings(actionData, SETTINGS_DEFAULT));
  } else if (actionType === "reset") {
    reset();
  } else if (actionType === "pageview") {
    sendPageView(actionData);
  } else if (actionType === "donation") {
    window.postMessage({ type: "donationFinished" });
  } else if (actionType === "disable") {
    setSettings(s => {
      return { ...s, ...SETTINGS_DISABLE_ALL };
    });
  } else if (actionType === "enable") {
    setSettings(s => {
      return { ...s, ...SETTINGS_ENABLE_ALL };
    });
  } else if (actionType === "updatesettings") {
    setSettings(s => mergeInNewSettings(actionData, s));
  } else if (actionType === "setreadcontents") {
    setReadContents(actionData);
  } else if (actionType === "setitempreset") {
    setSettings(s => {
      const presetItems = itemPresets[actionData];
      return !presetItems
        ? s
        : {
            ...s,
            intrusivenessLevels: s.intrusivenessLevels.map((il, i) => {
              return {
                ...il,
                itemSelectorSettings: {
                  items: presetItems,
                  preselectedItems: [presetItems[i]]
                }
              };
            })
          };
    });
  }
}

function handleExistingActions(actionHandler) {
  if (Array.isArray(window.donEncLayer)) {
    window.donEncLayer.forEach(actionHandler);
  }
}

function startActionListener(actionHandler) {
  window.donEncLayer = onChange([], actionHandler, true);
}

function onChange(object, callback, ignoreValue) {
  return new Proxy(object, {
    set: (obj, prop, val) => {
      if (!ignoreValue) obj[prop] = val;
      callback(val);
      return true;
    }
  });
}

function ts() {
  return new Date().getTime();
}

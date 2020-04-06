import { useState, useEffect } from "react";
import {
  CONTENT_TYPE_DEFAULT,
  SETTINGS_DEFAULT,
  SETTINGS_DISABLE_ALL,
  SETTINGS_ENABLE_ALL,
  mergeInNewSettings,
  itemPresets,
} from "../settings-default";

export default function useActions(setSettings, storage) {
  const { reset, setReadContents, setMemberValidation } = storage;
  const [currentContent, setCurrentContent] = useState({});
  const sendPageView = (contentType) => {
    setCurrentContent({ ts: ts(), type: contentType || CONTENT_TYPE_DEFAULT });
  };

  useEffect(() => {
    const storageFuncs = { reset, setReadContents, setMemberValidation };
    const funcs = { setSettings, sendPageView, ...storageFuncs };
    const actionHandler = (a) => handleAction(a, funcs);
    handleExistingActions(actionHandler);
    startActionListener(actionHandler);
    return () => {};
  }, [setSettings, reset, setReadContents, setMemberValidation]);

  return currentContent;
}

function handleAction(action, funcs) {
  const { setSettings, sendPageView } = funcs;
  const { reset, setReadContents, setMemberValidation } = funcs;
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
    setSettings((s) => {
      return { ...s, ...SETTINGS_DISABLE_ALL };
    });
  } else if (actionType === "enable") {
    setSettings((s) => {
      return { ...s, ...SETTINGS_ENABLE_ALL };
    });
  } else if (actionType === "updatesettings") {
    setSettings((s) => mergeInNewSettings(actionData, s));
  } else if (actionType === "setreadcontents") {
    setReadContents(actionData);
  } else if (actionType === "setitempreset") {
    const presetItems = itemPresets[actionData];
    if (!presetItems) return;
    setSettings((s) => ({
      ...s,
      itemSelectorSettings: {
        ...s.itemSelectorSettings,
        items: presetItems,
      },
    }));
  } else if (actionType === "validatemember") {
    setMemberValidation(ts());
  } else if (actionType === "invalidatemember") {
    setMemberValidation(undefined);
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
    },
  });
}

export function ts() {
  return new Date().getTime();
}

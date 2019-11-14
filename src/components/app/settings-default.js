import {
  faCoffee,
  faIceCream,
  faPizzaSlice,
  faGem
} from "@fortawesome/free-solid-svg-icons";

export const CONTENT_TYPE_DEFAULT = "default";

const ITEMS_EMOJI1 = [
  // { value: 1.5, icon: "🥨" },
  { value: 3, icon: "☕️" },
  // { value: 3.5, icon: "🍺️" },
  { value: 5, icon: "🍕" },
  // { value: 5, icon: "🌹" },
  // { value: 6, icon: "🍔" },
  // { value: 7, icon: "🥟" },
  // { value: 8, icon: "🍾" },
  // { value: 9, icon: "🎟" },
  // { value: 9, icon: "🍱" },
  { value: 12, icon: "💐" },
  // { value: 25, icon: "🥇" },
  // { value: 35, icon: "🎫" },
  // { value: 50, icon: "🏆" },
  // { value: 75, icon: "💎" },
  { value: 50, icon: "💰" }
];

const ITEMS_EMOJI2 = [
  // { value: 1.5, icon: "🥨" },
  { value: 2, icon: "🍭" },
  // { value: 2.5, icon: "☕️" },
  { value: 4, icon: "🍺️" },
  // { value: 5, icon: "🍕" },
  { value: 6, icon: "🌹" },
  // { value: 6, icon: "🍔" },
  // { value: 7, icon: "🥟" },
  // { value: 8, icon: "🍾" },
  // { value: 9, icon: "🎟" }
  // { value: 9, icon: "🍱" },
  // { value: 15, icon: "💐" },
  // { value: 25, icon: "🥇" },
  { value: 15, icon: "🎫" }
  // { value: 50, icon: "🏆" },
  // { value: 75, icon: "💎" },
  // { value: 100, icon: "💰" }
];

const ITEMS_BLACK = [
  { value: 2, icon: faIceCream },
  { value: 3, icon: faCoffee },
  { value: 5, icon: faPizzaSlice },
  { value: 15, icon: faGem }
];

export const itemPresets = {
  black: ITEMS_BLACK,
  emoji1: ITEMS_EMOJI1,
  emoji2: ITEMS_EMOJI2
};

const ITEMS_DEFAULT = itemPresets.emoji2;

export const INTRUSIVENESS_LEVELS_DEFAULT = [
  {
    // level 1
    contentThreshold: 1,
    boxSettings: [{ position: "bottom", expanded: true }],
    itemSelectorSettings: {
      items: ITEMS_DEFAULT,
      preselectedItems: [ITEMS_DEFAULT[0]]
    }
  },
  {
    // level 2
    contentThreshold: 5,
    boxSettings: [
      { position: "middle", expanded: false },
      { position: "bottom", expanded: true }
    ],
    itemSelectorSettings: {
      items: ITEMS_DEFAULT,
      preselectedItems: [ITEMS_DEFAULT[1]]
    }
  },
  {
    // level 3
    contentThreshold: 10,
    boxSettings: [
      { position: "middle", expanded: true },
      { position: "bottom", expanded: true }
    ],
    itemSelectorSettings: {
      items: ITEMS_DEFAULT,
      preselectedItems: [ITEMS_DEFAULT[3]]
    },
    blurEnabled: true
  }
];

const CONTENT_TYPES_DEFAULT = {
  [CONTENT_TYPE_DEFAULT]: { singular: "Inhalt", plural: "Inhalte" },
  article: { singular: "Artikel", plural: "Artikel" },
  gnose: { singular: "Gnose", plural: "Gnosen" }
};

const STRINGS_DEFAULT = {
  lead: totalContents =>
    `${totalContents === 1 ? "Inhalt" : "Inhalte"} bisher gelesen`,
  body: (timeStr, contentsStr, amount, storage) =>
    `Du hast bislang <strong>${contentsStr}</strong> auf dekoder gelesen.* Was ${
      storage.totalContents === 1
        ? storage.readContents.gnose === 1
          ? "ist sie"
          : "ist er"
        : "sind sie"
    } dir wert? Vielleicht <strong>${amount} €</strong>?`,
  ctaBtn: (timeStr, contentsString, amount) => `Mit ${amount} € danken`,
  blurRemover: "Einfach weiterlesen",
  footer: timeStr =>
    `* Lesezeit insgesamt auf dekoder: ${timeStr}. Diese Daten werden nur in deinem Browser gespeichert und nicht auf unsere Server übertragen!`,
  resetBtn: "Zähler zurücksetzen",
  feedbackTitle: "Vielen Dank für deine Spende",
  feedbackBody:
    "Gerade für uns als gemeinnütziges Projekt ist das Engagement unserer Leserinnen und Leser besonders wertvoll und wir freuen uns, dass du uns unterstützt – vielen Dank! Wir setzen nun deinen Zähler zurück ...",
  feedbackBtn: "Ok",
  credit: `developed by <a href="https://www.dekoder.org/" target="_blank">dekoder</a>`
};

export const SETTINGS_DEFAULT = {
  targetSelector: ".entry-content",
  excludeSelector: "hr, h6, aside",
  contentTypes: CONTENT_TYPES_DEFAULT,
  twingleWidgetUrl: "",
  ctaTargetUrl: amount =>
    `https://www.dekoder.org/de/spenden?tw_amount=${amount}`,
  intrusivenessLevels: INTRUSIVENESS_LEVELS_DEFAULT,
  wrapperClass: "donation-encourager__wrapper",
  storageKey: "donation-encourager-tracker",
  trackerEnabled: true,
  donationListenerEnabled: true,
  boxesEnabled: true,
  domObserverEnabled: false,
  locale: "de-DE",
  strings: STRINGS_DEFAULT
};

export const SETTINGS_DISABLE_ALL = {
  trackerEnabled: false,
  donationListenerEnabled: false,
  boxesEnabled: false
};

export const SETTINGS_ENABLE_ALL = {
  trackerEnabled: true,
  donationListenerEnabled: true,
  boxesEnabled: true
};

export const SETTINGS_DEFAULT_DISABLED = {
  ...SETTINGS_DEFAULT,
  ...SETTINGS_DISABLE_ALL
};

export function mergeInNewSettings(
  newSettings,
  oldSettings = SETTINGS_DEFAULT
) {
  return {
    ...oldSettings,
    ...newSettings,
    contentTypes: {
      ...oldSettings.contentTypes,
      ...(newSettings.contentTypes || {})
    },
    strings: {
      ...oldSettings.strings,
      ...(newSettings.strings || {})
    }
  };
}

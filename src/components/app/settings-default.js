/* import {
  faCoffee,
  faIceCream,
  faPizzaSlice,
  faGem,
} from "@fortawesome/free-solid-svg-icons" */

export const CONTENT_TYPE_DEFAULT = "default"

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
  { value: 50, icon: "💰" },
]

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
  { value: 16, icon: "🎫" },
  // { value: 50, icon: "🏆" },
  // { value: 75, icon: "💎" },
  // { value: 100, icon: "💰" }
]

/* const ITEMS_BLACK = [
  { value: 2, icon: faIceCream },
  { value: 3, icon: faCoffee },
  { value: 5, icon: faPizzaSlice },
  { value: 15, icon: faGem },
] */

export const itemPresets = {
  // black: ITEMS_BLACK,
  emoji1: ITEMS_EMOJI1,
  emoji2: ITEMS_EMOJI2,
}

const ITEMS_DEFAULT = itemPresets.emoji2

export const INTRUSIVENESS_LEVELS_DEFAULT = [
  {
    // level 0: no display for validated members
    contentThreshold: 0,
    boxSettings: [],
  },
  {
    // level 1
    contentThreshold: 0,
    boxSettings: [{ position: "bottom", expanded: true }],
    itemSelectorSettings: {
      preselectedItemsFilter: (item, i) => i === 0,
    },
  },
  {
    // level 2
    contentThreshold: 5,
    boxSettings: [
      { position: "middle", expanded: false },
      { position: "bottom", expanded: true },
    ],
    itemSelectorSettings: {
      preselectedItemsFilter: (item, i) => i === 1,
    },
  },
  {
    // level 3
    contentThreshold: 10,
    boxSettings: [
      { position: "middle", expanded: true },
      { position: "bottom", expanded: true },
    ],
    itemSelectorSettings: {
      preselectedItemsFilter: (item, i) => i === 2,
    },
    contentLockEnabled: true,
  },
]

const CONTENT_TYPES_DEFAULT = {
  [CONTENT_TYPE_DEFAULT]: { singular: "Inhalt", plural: "Inhalte" },
  article: { singular: "Artikel", plural: "Artikel" },
  gnose: { singular: "Gnose", plural: "Gnosen" },
  special: { singular: "Special-Inhalt", plural: "Special-Inhalte" },
}

const STRINGS_DEFAULT = {
  currency: (amount) => `${amount} €`,
  and: "und",
  hours: { singular: "Stunde", plural: "Stunden" },
  minutes: { singular: "Minute", plural: "Minuten" },
  lead: (totalContents) =>
    `${totalContents === 1 ? "Inhalt" : "Inhalte"} bisher gelesen`,
  body: (timeStr, contentsStr, amountStr, storage) =>
    storage.totalContents
      ? `Du hast bislang <strong>${contentsStr}</strong> auf dekoder gelesen.* Was ${
          storage.totalContents === 1
            ? storage.readContents.gnose === 1
              ? "ist sie"
              : "ist er"
            : "sind sie"
        } dir wert? Vielleicht <strong>${amountStr}</strong>?`
      : "",
  monthly: "Monatlich spenden?",
  ctaBtn: (timeStr, contentsStr, amountStr, storage, isMonthly) =>
    `Mit ${amountStr} danken, ${isMonthly ? "jeden Monat!" : "einmalig"}`,
  unlockBtn: "Erstmal weiterlesen",
  footer: (timeStr) =>
    `* Lesezeit insgesamt auf dekoder: ${timeStr}. Diese Daten werden nur in deinem Browser gespeichert und nicht auf unsere Server übertragen!`,
  resetBtn: "Zähler zurücksetzen",
  feedbackTitle: "Vielen Dank für deine Spende",
  feedbackBody:
    "Gerade für uns als gemeinnütziges Projekt ist das Engagement unserer Leserinnen und Leser besonders wertvoll und wir freuen uns, dass du uns unterstützt – vielen Dank! Wir setzen nun deinen Zähler zurück ...",
  feedbackBtn: "OK",
  backBtn: "Zurück",
  credit: `developed by <a href="https://www.dekoder.org/" target="_blank">dekoder</a>`,
  otherPaymentMethods: "andere Zahlungswege",
  paypalSingleName: "einmalige Spende",
  paypalMonthlyName: "monatliche Spende",
}

const CLASS_NAMES_DEFAULT = {
  wrapper: "donation-encourager__wrapper",
  box: "donation-encourager",
  collapseMe: "donation-encourager__collapse-me",
  lead: "donation-encourager__lead",
  headline: "donation-encourager__headline",
  leadText: "donation-encourager__lead-text",
  body: "donation-encourager__body",
  meta: "donation-encourager__meta",
  resetBtn: "donation-encourager__reset-btn",
  cta: "donation-encourager__cta",
  button: "donation-encourager__button",
  ctaButton: "donation-encourager__cta-button",
  unlockButton: "donation-encourager__unlock-button",
  itemSelector: "donation-encourager__item-selector",
  credit: "donation-encourager__credit",
  strikeOut: "donation-encourager__strike-out",
  monthlyCheck: "donation-encourager__monthly-check",
  lockContent: "donation-encourager__lock-content",
  gradient: "donation-encourager__gradient",
  feedback: "donation-encourager__feedback",
  feedbackOverlay: ".donation-encourager__feedback-overlay",
}

export const SETTINGS_DEFAULT = {
  targetSelector: ".entry-content",
  excludeSelector: "hr, h6, aside, span, script",
  contentTypes: CONTENT_TYPES_DEFAULT,
  twingleWidgetUrl: "",
  paypalId: "",
  paypalReturnUrl: "",
  ctaTargetUrl: (amountVal) =>
    `https://www.dekoder.org/de/spenden?tw_amount=${amountVal}`,
  intrusivenessLevels: INTRUSIVENESS_LEVELS_DEFAULT,
  itemSelectorSettings: {
    items: ITEMS_DEFAULT,
    preselectedItemsFilter: (item, i) => i === 0,
  },
  storageKey: "donation-encourager-tracker",
  crossStorageUrl: "",
  trackerEnabled: true,
  donationListenerEnabled: true,
  boxesEnabled: true,
  domObserverEnabled: false,
  locale: "de-DE",
  strings: STRINGS_DEFAULT,
  discount: undefined,
  hooks: {
    onResetBtnClick: undefined,
    onCtaBtnClick: undefined,
    onUnlockBtnClick: undefined,
    onBackBtnClick: undefined,
    onDonationFinished: undefined,
  },
  classNames: CLASS_NAMES_DEFAULT,
}

export const SETTINGS_DISABLE_ALL = {
  trackerEnabled: false,
  donationListenerEnabled: false,
  boxesEnabled: false,
}

export const SETTINGS_ENABLE_ALL = {
  trackerEnabled: true,
  donationListenerEnabled: true,
  boxesEnabled: true,
}

export const SETTINGS_DEFAULT_DISABLED = {
  ...SETTINGS_DEFAULT,
  ...SETTINGS_DISABLE_ALL,
}

export function mergeInNewSettings(
  newSettings,
  oldSettings = SETTINGS_DEFAULT,
) {
  return {
    ...oldSettings,
    ...newSettings,
    contentTypes: {
      ...oldSettings.contentTypes,
      ...(newSettings.contentTypes || {}),
    },
    strings: {
      ...oldSettings.strings,
      ...(newSettings.strings || {}),
    },
    hooks: {
      ...oldSettings.hooks,
      ...(newSettings.hooks || {}),
    },
  }
}

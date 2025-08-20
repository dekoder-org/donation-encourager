# Donation Encourager

Remind your readers with a smile about donating and provide them an easy way to do so. The tool places itself in (or below) the body text of your site's articles. It comes with different levels of intrusiveness, based on the amount of read contents by the user, and gives you a lot of possibilites for customization – check out our example and the API sections below.

The tool was developed by [dekoder.org](https://www.dekoder.org/) and [Palasthotel](https://palasthotel.de/).

![Donation Encourager Example Image](https://www.dekoder.org/sites/default/files/donation-encourager-preview.png)

## Example

Check out our dekoder-[test-page](https://www.dekoder.org/de/article/greta-thunberg-diskurs-weltklimagipfel?donation-encourager=test) and use the red buttons to see the Donation Encourager in different configurations.

## Download

Find the latest build [here](https://unpkg.com/donation-encourager).

## Quick Start

```html
<script src="donation-encourager.js" defer></script>
<script>
  window.donEncLayer = window.donEncLayer || []
  function donEnc() {
    donEncLayer.push(arguments)
  }
  donEnc("init", {
    targetSelector: ".ph-article-text",
    ctaTargetUrl: function (amount) {
      return "https://www.dekoder.org/de/spenden?tw_amount=" + amount
    },
  })
  donEnc("pageview")
</script>
```

The `init` action passes a `settings` object into the app. You have to specify at least two options:

1.  `targetSelector`: Tell the app where to place its boxes (usually the article's body).
2.  - `ctaTargetUrl`: Tell the app which donation URL to open on button click.
    - Alternatively `twingleWidgetUrl`: If you use [Twingle](https://www.twingle.de/), you can also render your Twingle donation widget inside the donation encourager box.

## Actions

You can control the app with actions, which are triggered by the above defined `donEnc()` function.

```js
donEnc(actionType, actionData)
```

(Implementation: [site-actions.js](https://github.com/dekoder-org/donation-encourager/blob/master/src/components/app/hooks/site-actions.js))

| actionType          | actionData                 | description                                                                                                                                                                                                                |
| ------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"init"`            | `settings`                 | Initialize the app with your custom `settings`. See more on the `settings` options in the Settings section below.                                                                                                          |
| `"pageview"`        | `contentType` (optional)   | Send a pageview. You can optionally pass a `contentType`, if you want to track different content types. Make sure you specify all your content types in the settings (see details below).                                  |
| `"reset"`           | –                          |  Resets all tracker data to zero (reading time and read contents).                                                                                                                                                         |
| `"donation"`        | –                          | Triggers the donation feedback message, after which the tracker will be reset.                                                                                                                                             |
| `"disable"`         | –                          | Disable content and time tracking, the donation listener (which listens to `"donationFinished"` messages from your Twingle widget and triggers the donation feedback, see above) and remove all donation encourager boxes. |
| `"enable"`          | –                          | Enable content and time tracking, donation listener, and donation encourager boxes.                                                                                                                                        |
| `"updateSettings"`  | `settings`                 | Update one or more property of the current `settings` object.                                                                                                                                                              |
| `"setReadContents"` | `{ [contentType]: [INT] }` | Makes testing of different `intrusivenessLevles` (see Settings section below) easier ;-)                                                                                                                                   |
| `"setItemPresets"`  | presetName                 | Try `"emoji1"` or `"emoji2"`.                                                                                                                                                                                              |

## Settings

The `settings` object has the following properties:

(Implementation: [settings-default.js](https://github.com/dekoder-org/donation-encourager/blob/master/src/components/app/settings-default.js))

| property                | default value                                                                                                      | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| targetSelector          | `".entry-content"`                                                                                                 | CSS-selector that indicates where to place the donation encourager boxes (usually the articles text body).                                                                                                                                                                                                                                                                                                                                                                         |
| excludeSelector         | `"hr, h6, aside, span, script"`                                                                                    | Don't take those elements into account for the box positioner.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| contentTypes            | `CONTENT_TYPES_DEFAULT`                                                                                            | Defines the content types to track and how to spell them in the box body text. See content types section below.                                                                                                                                                                                                                                                                                                                                                                    |
| twingleWidgetUrl        | `""`                                                                                                               | If you use Twingle, indicate your Twingle widget URL to render the donation widget directly in the donation encourager box. How to find your widget URL: Log into to your TwingleManager, go to Project settings of your desired project, copy the "URL of the donation page", replace `/page` with `/widget` at the end of that URL. The Twingle widget URL should have the following format: `https://spenden.twingle.de/[YOUR-COMPANY-NAME]/[PROJECT-NAME]/[WIDGET-ID]/widget`. |
| ctaTargetUrl            | `function(amount) { return "https://www.dekoder.org/de/spenden?tw_amount=" + amount; }`                            |  Alternatively: Provide an URL of your custom donation site. When a user pushes the Donate-button your custom donation site will be opened in a new tab. `ctaTargetUrl` can be a string or also a function with the selected total amount as an argument.                                                                                                                                                                                                                          |
| intrusivenessLevels     | `INTRUSIVENESS_LEVELS_DEFAULT`                                                                                     | See Intrusiveness section below.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| itemSelectorSettings    | `{ items: ITEMS_DEFAULT, preselectedItemsFilter: function(item, i) { return i === 0; } }`                          | Provide an array of item objects for the ItemSelector (see section below) and an filter function to define which of them should be preselected by default.                                                                                                                                                                                                                                                                                                                         |
| storageKey              | `"donation-encourager-tracker"`                                                                                    | Tracker data will be stored in localStorage under this key.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| crossStorageUrl         | `""`                                                                                                               | ...                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| trackerEnabled          | `true`                                                                                                             |  Enables or disables the tracking of reading time and read contents. All tracking is done entirely on the user's machine. None of this data will be send to any server.                                                                                                                                                                                                                                                                                                            |
| donationListenerEnabled | `true`                                                                                                             | Enables or disables the donation listener which listens to `"donationFinished"` messages from your Twingle widget and triggers the donation feedback (see above).                                                                                                                                                                                                                                                                                                                  |
| boxesEnabled            | `true`                                                                                                             | Allow donation encourager boxes to be placed within your articles' text body (identified by the `targetSelector` above). The placement and the amount of the boxes depends from the `intrusivenessLevels` (see Intrusiveness section below).                                                                                                                                                                                                                                       |
| domObserverEnabled      | `false`                                                                                                            | Experimental feature: Enable if you want to engage a [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) that watches for added DOM-nodes with the given `targetSelector`. When such a relevant DOM change was observed boxes will updated according to the changes. This might be useful if contents are loaded dynamically on your page.                                                                                                       |
| locale                  | `"de-DE"`                                                                                                          | Defines, among others, how numbers are [represented](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString). E.g., use `"de-DE"` for German and `"en-EN"` for English style.                                                                                                                                                                                                                                                      |
| strings                 | `STRINGS_DEFAULT`                                                                                                  | See strings section below.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| discount                | `undefined`                                                                                                        | Optional: Provide a discount function, e.g. `function(amountVal) { return amountVal / 2 }`                                                                                                                                                                                                                                                                                                                                                                                         |
| hooks                   | `{ onResetBtnClick: undefined, onCtaBtnClick: undefined, onUnlockBtnClick: undefined, onBackBtnClick: undefined }` | Define hook functions to add some extra behavior. If a hook function returns `false` the default behavior will be prevented.                                                                                                                                                                                                                                                                                                                                                       |

## Content Types

You can track multiple content types by providing a `contentType` identifier in your `donEnc('pageview', contentType)` function. In your `settings.contentType` object, make sure to provide according namings in singular and plural for each of the used content type identifiers.

```js
const CONTENT_TYPES_DEFAULT = {
  default: { singular: "Inhalt", plural: "Inhalte" },
  article: { singular: "Artikel", plural: "Artikel" },
  gnose: { singular: "Gnose", plural: "Gnosen" },
}
```

## Intrusiveness

The donation encourager allows you to define multiple levels of intrusiveness. These configuration is stored in an array of objects in `settings.intrusivenessLevels`.

```js
const INTRUSIVENESS_LEVELS_DEFAULT = [
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
```

Each level is defined by an object with the following properties:

| property             | example                                    | description                                                                                                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| contentThreshold     | `5`                                        | Defines the threshold of read contents for this level settings to become active.                                                                                                                                                                                                              |
| boxSettings          | `[{ position: "bottom", expanded: true }]` | An array of box objects. Each box object must indicate the boxes position within the article's body text (it can one of `"top"`, `"middle"`, or `"bottom"` or a number indicating the exact block number; `0` means the first block) and whether the box should be initially expanded or not. |
| itemSelectorSettings | `{ preselectedItems: [ITEMS_DEFAULT[1]] }` | Optionally overwrite your default `itemSelectorSettings` from the `settings` object (partly or all).                                                                                                                                                                                          |
| contentLockEnabled   | `true`                                     | If enabled, all content blocks after the first donation encourager box will get locked. The user has to click the unlock button first to continue reading.                                                                                                                                    |

## ItemSelector items

The ItemSelector uses emoji icons. Defaults:

```js
const ITEMS_DEFAULT = [
  { value: 2, icon: "🍭" },
  { value: 4, icon: "🍺️" },
  { value: 6, icon: "🌹" },
  { value: 16, icon: "🎫" },
]
```

## Strings

The texts for the donation encourager boxes can be defined as static strings or, in case of `lead`, `body`, `ctaBtn` and `footer`, as functions that use some tracker data and the selected amount from the ItemSelector as arguments. See the defaults for details:

```js
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
```

## Custom Styling

Add your own CSS file with according classes to overwrite the default stylings.

Alternatively, you can override the default classes in `settings.classNames`:

```js
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
```

## Use with React (experimental)

To use the donation encourager in your React project, you can also install it as an npm module:

```sh
npm install donation-encourager
```

And then:

```js
import DonationEncourager, { donEnc } from "donation-encourager"
```

In your app's render function you could initialize the donation encourager like this:

```jsx
useEffect(() => {
  donEnc("init", {
    targetSelector: ".my-article-body",
  })
  donEnc("pageview")
}, [])

return (
  <App>
    <div className="my-article-body">...</div>
    <DonationEncourager />
  </App>
)
```

Make sure you use a Sass Loader (like [sass-loader](https://github.com/webpack-contrib/sass-loader) for Webpack) in your project.

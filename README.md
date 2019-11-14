# Donation Encourager

Remind your readers with a smile about donating and provide them an easy way to do so. The tool places itself in (or below) the body text of your site's articles. It comes with different levels of intrusiveness, based on the amount of read contents by the user, and gives you a lot of possibilites for customization – check out our example and the API sections below.

The tool was developed by [dekoder.org](https://www.dekoder.org/) and [Palasthotel](https://palasthotel.de/).

![Donation Encourager Example Image](https://www.dekoder.org/sites/default/files/donation-encourager-preview.png)

## Example

Check out our dekoder-[test-page](https://www.dekoder.org/de/article/greta-thunberg-diskurs-weltklimagipfel?donation-encourager=test) and use the red buttons to see the Donation Encourager in different configurations.

## Download

Find the latest build [here](https://donation-encourager.netlify.com/donation-encourager.js).

## Quick Start

```html
  <script src="donation-encourager.js"></script>
  <script>
    window.donEncLayer = window.donEncLayer || [];
    function donEnc() {donEncLayer.push(arguments)};
    donEnc('init', {
      targetSelector: '.ph-article-text',
      ctaTargetUrl: function(amount) {return 'https://www.dekoder.org/de/spenden?tw_amount=' + amount},
    });
    donEnc('pageview');
  </script>
```

The `init` action passes a `settings` object into the app. You have to specify at least two options:

1. `targetSelector`: Tell the app where to place its boxes (usually the article's body).
2. 
   * `ctaTargetUrl`: Tell the app which donation URL to open on button click.
   * Alternatively `twingleWidgetUrl`: If you use [Twingle](https://www.twingle.de/), you can also render your Twingle donation widget inside the donation encourager box.

## Actions

You can control the app with actions, which are triggered by the above defined `donEnc()` function.

```js
donEnc(actionType, actionData);
```

(Implementation: site-actions.js)

actionType | actionData | description
--- | ---- | ---
'init' | `settings` | Initialize the app with your custom `settings`. See more on the `settings` options in the Settings section below.
'pageview' | `contentType` (optional) | Send a pageview. You can optionally pass a `contentType`, if you want to track different content types. Make sure you specify all your content types in the settings (see details below).
'reset' | – | ...
'donation' | – | ...
'enable' | – | ...
'disable' | – | ...
'updateSettings' | – | ...
'setReadContents' | `{ [contentType]: [INT] }` | Makes testing of different `intrusivenessLevles` (see Settings section below) easier ;-)  
'setItemPresets' | presetName | Try `"emoji1"`, `"emoji2"` or `"black"`.

## Settings

The `settings` object contains the following fields: 

(Implementation: settings-default.js)

field | default value | description
--- | --- | ---
targetSelector | `".entry-content"` | CSS-selector that indicates where to place the donation encourager boxes (usually the article body).
excludeSelector | `"hr, h6, aside"` | Don't take those elements into account for the box positioner.
contentTypes | `CONTENT_TYPES_DEFAULT` | Defines the content types to track and how to spell them in the box body text. See content types section below.
twingleWidgetUrl | `""` | If you use Twingle, indicate yur Twingle widget URL to render the donation widget directly in the donation encourager box.
ctaTargetUrl | `function(amount) {return "https://www.dekoder.org/de/spenden?tw_amount=" + amount;}` | Alternatively: Indicate a custom URL of your donation site. The user then gets redirected there when he pushes the Donate-button. `ctaTargetUrl` can be a string or also a function with the selected total amount as an argument.
intrusivenessLevels | `INTRUSIVENESS_LEVELS_DEFAULT` | See Intrusiveness section below.
wrapperClass | `"donation-encourager__wrapper"` | ... 
storageKey | `"donation-encourager-tracker"` | ... 
trackerEnabled | `true` | ...
donationListenerEnabled | `true` | ...
boxesEnabled | `true` | ...
domObserverEnabled | `false` | Experimental feature for dynamic loaded contents ... 
locale | `"de-DE"` | ...
strings | `STRINGS_DEFAULT` | See strings section below. 

## Content Types

Default: 

```js
const CONTENT_TYPES_DEFAULT = {
  default: { singular: "Inhalt", plural: "Inhalte" },
  article: { singular: "Artikel", plural: "Artikel" },
  gnose: { singular: "Gnose", plural: "Gnosen" }
};
```

## Intrusiveness

Default configuration:

```js
const INTRUSIVENESS_LEVELS_DEFAULT = [
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
```

## ItemSelector items

Defaults:

```js
const ITEMS_DEFAULT = [
  { value: 2, icon: "🍭" },
  { value: 4, icon: "🍺️" },
  { value: 6, icon: "🌹" },
  { value: 15, icon: "🎫" },
];
```
## Strings

Defaults: 

```js
const STRINGS_DEFAULT = {
  lead: totalContents =>
    `${totalContents === 1 ? "Inhalt" : "Inhalte"} bisher gelesen`,
  body: (timeStr, contentsStr, amount, storage) =>
    storage.totalContents
      ? `Du hast bislang <strong>${contentsStr}</strong> auf dekoder gelesen.* Was ${
          storage.totalContents === 1
            ? storage.readContents.gnose === 1
              ? "ist sie"
              : "ist er"
            : "sind sie"
        } dir wert? Vielleicht <strong>${amount} €</strong>?`
      : "",
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
```

## Styling

...



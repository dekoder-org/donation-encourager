import React, { useEffect } from "react"
import BackButton from "./back-button"

export default function TwingleWidget({
  amount,
  exit,
  widgetUrl,
  isMonthly,
}) {
  const widgetId = "_rl60hvpcu" // random string
  useTwingleResizeListener()
  const url = `${widgetUrl}/${widgetId}?tw_amount=${amount}${
    isMonthly ? "&tw_rhythm=monthly" : ""
  }`
  return (
    <div className="donation-encourager__twingle-wrapper">
      <BackButton onClick={exit} />
      <iframe
        scrolling="no"
        id={`twingleframe-${widgetId}`}
        src={url}
        style={{
          width: "100%",
          border: "none",
          overflow: "hidden",
          height: "400px",
          position: "relative",
          zIndex: 2,
        }}
      />
    </div>
  )
}

// see: https://spenden.twingle.de/embed/dekoder-ggmbh/dekoder-org/tw5979cc899e735/widget
function useTwingleResizeListener() {
  useEffect(() => {
    const __twingleMessageListener = function (event) {
      if (event.data && event.data.type && event.data.cid) {
        var __twingleWidgetIframe = document.getElementById(
          "twingleframe-" + event.data.cid
        )
        if (__twingleWidgetIframe) {
          switch (event.data.type) {
            case "size":
              __twingleWidgetIframe.style.height = event.data.value + "px"
              break
            case "geturl":
              __twingleWidgetIframe.contentWindow.postMessage(
                {
                  type: "seturl",
                  value: window.location.href,
                },
                "*"
              )
              break
            case "scrollToTop":
              if (typeof __twingleWidgetIframe.scrollIntoView !== "undefined") {
                __twingleWidgetIframe.scrollIntoView(true)
                if (window.scrollTo) {
                  // in some cases we need some offset, the iframe will tell us
                  var offset = event.data.value ? event.data.value : 0
                  // scroll 80px more to avoid sticky headers
                  offset -= 80
                  window.scrollTo(0, window.scrollY + offset)
                }
              }
              break
          }
        }
      }
    }
    window.addEventListener("message", __twingleMessageListener, false)
    return () => window.removeEventListener("message", __twingleMessageListener)
  }, [])
}

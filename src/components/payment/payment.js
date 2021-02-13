import { useContext } from "react"
import usePaypal from "./paypal"
import useTwingle from "./twingle"
import { Settings } from "../app/contexts"
import { strOrFunc } from "../box/helpers"

function usePay(amount, isFdbkShown) {
  const openDonUrl = useDonationUrl(amount.val)
  const [twingleWidget, startTwingle] = useTwingle(openDonUrl, isFdbkShown)
  const [paypalBtn, startPaypal] = usePaypal(startTwingle)
  const onCtaClick = startPaypal || startTwingle || openDonUrl
  return [paypalBtn, twingleWidget, onCtaClick]
}

export default usePay

function useDonationUrl(amountVal) {
  const { ctaTargetUrl } = useContext(Settings)
  const targetUrl = strOrFunc(ctaTargetUrl, [amountVal])
  if (!targetUrl) return null
  return () => {
    window.open(targetUrl)
  }
}

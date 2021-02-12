import React, { useContext, useState } from "react"
import { Settings } from "../app/contexts"
import { Amount } from "../box/contexts"
import BackButton from "../twingle-widget/back-button"

const PaypalMonthly = ({ amountStr }) => (
  <>
    <input type="hidden" name="cmd" value="_xclick-subscriptions" />
    <input type="hidden" name="currency_code" value="EUR" />
    <input type="hidden" name="a3" value={amountStr} />
    <input type="hidden" name="p3" value="1" />
    <input type="hidden" name="t3" value="M" />
    <input type="hidden" name="src" value="1" />
  </>
)

const PaypalSingle = ({ amountStr }) => (
  <>
    <input type="hidden" name="cmd" value="_donations" />
    <input type="hidden" name="amount" value={amountStr} />
  </>
)

const PayMethSelector = ({ isMonthly, exit, startTwingle, paypalId }) => {
  const amount = useContext(Amount)
  const amountStr = `${amount.val}.00`

  function onOtherClick() {
    exit()
    startTwingle()
  }

  return (
    <>
      <BackButton onClick={exit} />
      <div style={{ padding: "8em 0", display: "flex" }}>
        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          // target="_top"
          target="_blank"
          style={{
            width: "100%",
            marginRight: "10px",
          }}
        >
          <input type="hidden" name="business" value={paypalId} />

          {isMonthly ? (
            <PaypalMonthly amountStr={amountStr} />
          ) : (
            <PaypalSingle amountStr={amountStr} />
          )}

          <input type="hidden" name="return" value={location.href} />
          <button
            class="donation-encourager__button donation-encourager__cta-button"
            style={{ width: "100%" }}
          >
            PayPal
          </button>
        </form>
        <button
          onClick={onOtherClick}
          class="donation-encourager__button donation-encourager__unlock-button"
          style={{ width: "100%" }}
        >
          andere Zahlungswege
        </button>
      </div>
    </>
  )
}

export const usePayMethSelect = (props = {}) => {
  const [active, setActive] = useState(false)
  const { paypalId } = useContext(Settings)
  const onCtaBtnClick = paypalId
    ? (e) => {
        e.preventDefault()
        setActive(true)
      }
    : props.startTwingle
  const comp = active && (
    <PayMethSelector
      {...props}
      paypalId={paypalId}
      exit={() => setActive(false)}
    />
  )
  return [comp, onCtaBtnClick]
}

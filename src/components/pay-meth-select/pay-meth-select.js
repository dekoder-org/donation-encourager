import React, { useContext, useState } from "react"
import { Settings } from "../app/contexts"
import { Amount } from "../box/contexts"
// import BackButton from "../twingle-widget/back-button"

const PaypalMonthly = ({ amountStr, name }) => (
  <>
    <input type="hidden" name="cmd" value="_xclick-subscriptions" />
    <input type="hidden" name="currency_code" value="EUR" />
    <input type="hidden" name="a3" value={amountStr} />
    <input type="hidden" name="p3" value="1" />
    <input type="hidden" name="t3" value="M" />
    <input type="hidden" name="src" value="1" />
    <input type="hidden" name="item_name" value={name} />
  </>
)

const PaypalSingle = ({ amountStr, name }) => (
  <>
    <input type="hidden" name="cmd" value="_donations" />
    <input type="hidden" name="amount" value={amountStr} />
    <input type="hidden" name="item_name" value={name} />
  </>
)

const PayMethSelector = ({ isMonthly, exit, startTwingle, paypalId }) => {
  const amount = useContext(Amount)
  const { strings } = useContext(Settings)
  const amountStr = `${amount.val}.00`

  function onOtherClick() {
    exit()
    startTwingle()
  }

  return (
    <div class="donation-encourager__cta" >
      <form
        action="https://www.paypal.com/cgi-bin/webscr"
        method="post"
        // target="_top"
        target="_blank"
        style={{
          // width: "100%",
          // marginRight: "10px",
        }}
      >
        <input type="hidden" name="business" value={paypalId} />

        {isMonthly ? (
          <PaypalMonthly amountStr={amountStr} name={strings.paypalMonthlyName} />
        ) : (
          <PaypalSingle amountStr={amountStr} name={strings.paypalSingleName} />
        )}

        <input type="hidden" name="return" value={location.href} />
        <button
          class="donation-encourager__button donation-encourager__cta-button"
          // style={{ width: "100%" }}
        >
          PayPal
        </button>
      </form>
      <button
        onClick={onOtherClick}
        class="donation-encourager__button donation-encourager__unlock-button"
        // style={{ width: "100%" }}
      >
        andere Zahlungswege
      </button>
    </div>
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

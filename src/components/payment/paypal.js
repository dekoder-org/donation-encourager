import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react"
import { Settings } from "../app/contexts"
import { Amount } from "../box/contexts"
import { strOrFunc } from "../box/helpers"

const usePaypal = (alternativeAction) => {
  const [active, setActive] = useState(false)
  const { paypalId } = useContext(Settings)
  const onCtaBtnClick = paypalId
    ? (e) => {
        e.preventDefault()
        setActive(true)
      }
    : alternativeAction
  const exit = useCallback(() => setActive(false), [])
  const comp = active && (
    <PaypalBtn
      alternativeAction={alternativeAction}
      paypalId={paypalId}
      exit={exit}
    />
  )
  return [comp, onCtaBtnClick]
}

export default usePaypal

function PaypalBtn({ alternativeAction, paypalId, exit }) {
  const ref = useRef()
  const { isMonthly, val } = useContext(Amount)
  const { paypalReturnUrl, strings, classNames } = useContext(Settings)
  const { paypalMonthlyName, paypalSingleName, otherPaymentMethods } = strings
  const amountStr = `${val}.00`

  useEffect(() => {
    if (!alternativeAction) {
      // submit immediately if no other payment methods specified
      ref.current.submit()
      setTimeout(exit, 1000)
    }
  }, [alternativeAction, exit])

  const returnUrl = strOrFunc(paypalReturnUrl, []) || location.href

  return (
    <div className={classNames.cta} hidden={!alternativeAction}>
      <form
        action="https://www.paypal.com/cgi-bin/webscr"
        method="post"
        target="_blank" // _top
        ref={ref}
      >
        <input type="hidden" name="business" value={paypalId} />

        {isMonthly ? ( // <input type="hidden" name="cmd" value="_xclick-subscriptions" />
          <>
            <input type="hidden" name="cmd" value="_xclick-subscriptions" />
            <input type="hidden" name="currency_code" value="EUR" />
            <input type="hidden" name="a3" value={amountStr} />
            <input type="hidden" name="p3" value="1" />
            <input type="hidden" name="t3" value="M" />
            <input type="hidden" name="src" value="1" />
            <input
              type="hidden"
              name="item_name"
              value={paypalMonthlyName || ""}
            />
          </>
        ) : (
          <>
            <input type="hidden" name="cmd" value="_donations" />
            <input type="hidden" name="amount" value={amountStr} />
            <input
              type="hidden"
              name="item_name"
              value={paypalSingleName || ""}
            />
          </>
        )}

        <input type="hidden" name="return" value={returnUrl} />
        <button className={`${classNames.button} ${classNames.ctaButton}`}>
          PayPal
        </button>
      </form>
      {!!alternativeAction && (
        <button
          onClick={alternativeAction}
          className={`${classNames.button} ${classNames.ctaButton}`}
        >
          {otherPaymentMethods}
        </button>
      )}
    </div>
  )
}

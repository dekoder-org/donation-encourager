import React, { useState, useContext, useMemo } from "react";
import ItemSelector from "./item-selector-component";
import { Settings } from "../app/contexts";

const STRIKEOUT_CLASS = "donation-encourager__strike-out";

export default function useItemSelector({ items, preselectedItemsFilter }) {
  const preselectedItems = items.filter(preselectedItemsFilter);
  const [selectedItems, setSelectedItems] = useState(preselectedItems);
  const undiscountedVal = sumUp(selectedItems);
  const discountedVal = useDiscount(undiscountedVal, selectedItems);
  const amount = useAmountObject(undiscountedVal, discountedVal);
  const itemSelector = (
    <ItemSelector
      items={items}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
    />
  );
  return [itemSelector, amount];
}

function sumUp(items) {
  return items.reduce((acc, curr) => acc + curr.value, 0);
}

function useDiscount(undiscountedVal, selectedItems) {
  const { discount } = useContext(Settings);
  return typeof discount === "function"
    ? discount(undiscountedVal, selectedItems)
    : undiscountedVal;
}

function useAmountObject(undiscountedVal, discountedVal) {
  const { locale, strings } = useContext(Settings);
  const { currency } = strings;
  const undiscountedRounded = Math.round(undiscountedVal);
  const discountedRounded = Math.round(discountedVal);
  return useMemo(
    () => ({
      val: discountedRounded,
      str:
        undiscountedRounded !== discountedRounded
          ? `<span class="${STRIKEOUT_CLASS}">
                <span class="${STRIKEOUT_CLASS}-stroke"></span>
                <span class="${STRIKEOUT_CLASS}-text">
                  ${moneyStr(undiscountedRounded, locale, currency)}
                </span>
              </span> ${moneyStr(discountedRounded, locale, currency)}`
          : `${moneyStr(undiscountedRounded, locale, currency)}`,
    }),
    [undiscountedRounded, discountedRounded, locale, currency]
  );
}

export function moneyStr(amount, locale, currency) {
  const numberStr = amount.toLocaleString(locale, {
    minimumFractionDigits: amount % 1 ? 2 : 0,
  });
  return typeof currency === "function"
    ? currency(numberStr)
    : `${numberStr} ${currency}`;
}

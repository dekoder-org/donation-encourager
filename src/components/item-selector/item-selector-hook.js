import React, { useState, useContext, useMemo } from "react";
import ItemSelector from "./item-selector-component";
import { Settings } from "../app/contexts";

const STRIKEOUT_CLASS = "donation-encourager__strike-out";

export default function useItemSelector({ items, preselectedItems }) {
  const [selectedItems, setSelectedItems] = useState(preselectedItems);
  const undiscountedVal = sumUp(selectedItems);
  const { discount, locale } = useContext(Settings);
  const discountedVal = useDiscount(discount, undiscountedVal, selectedItems);
  const amount = useAmountObject(undiscountedVal, discountedVal, locale);
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

function useDiscount(discount, undiscountedVal, selectedItems) {
  return typeof discount === "function"
    ? discount(undiscountedVal, selectedItems)
    : undiscountedVal;
}

function useAmountObject(undiscountedVal, discountedVal, locale) {
  const undiscountedRounded = Math.round(undiscountedVal);
  const discountedRounded = Math.round(discountedVal);
  return useMemo(
    () => ({
      val: discountedRounded,
      str:
        undiscountedRounded !== discountedRounded
          ? `<span class="${STRIKEOUT_CLASS}">${moneyStr(
              undiscountedRounded
            )}</span> ${moneyStr(discountedRounded)}`
          : moneyStr(undiscountedRounded, locale)
    }),
    [undiscountedRounded, discountedRounded, locale]
  );
}

export function moneyStr(amount, locale) {
  return amount.toLocaleString(locale, {
    minimumFractionDigits: amount % 1 ? 2 : 0
  });
}

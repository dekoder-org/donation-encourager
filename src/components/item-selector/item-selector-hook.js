import React, { useState } from "react";
import ItemSelector from "./item-selector-component";

export default function useItemSelector({ items, preselectedItems }) {
  const [selectedItems, setSelectedItems] = useState(preselectedItems);
  const totalValue = selectedItems.reduce((acc, curr) => acc + curr.value, 0);
  const itemSelector = (
    <ItemSelector
      items={items}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
    />
  );
  return [itemSelector, totalValue];
}

import React, { useContext, useState } from "react"
import { Settings } from "../app/contexts"
import { Draggable, DropTarget } from "./drag-drop"
import "./item-selector.scss"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ItemSelector = ({ items = [], selectedItems, setSelectedItems }) => {
  const { classNames } = useContext(Settings)
  const dragListItems = items
  // allow each item only once:
  // const dragListItems = items.filter(s => !selectedItems.map(si => si.icon).includes(s.icon))

  const [moving, setMoving] = useState(false)

  const addToList = (item, pos = "end") => {
    let newSelectedItems = selectedItems.filter((i) => i.uid !== item.uid)
    const newItem = { ...item, uid: new Date().getTime() }
    const targetPos = pos === "end" ? newSelectedItems.length : pos
    newSelectedItems.splice(targetPos, 0, newItem)
    setSelectedItems(newSelectedItems)
  }

  const removeFromList = (uid) => {
    setSelectedItems([...selectedItems.filter((i) => i.uid !== uid)])
  }

  return (
    <div className={classNames.itemSelector}>
      <div className="donation-encourager__drag-list">
        {dragListItems.map((item, i) => {
          item = { ...item, uid: i }
          return (
            <Draggable
              key={i}
              dragData={item}
              onDragStart={() => setMoving(true)}
              onDragEnd={() => setMoving(false)}
            >
              <div
                className={`donation-encourager__item`}
                onClick={() => addToList(item)}
              >
                {renderIcon(item.icon)}
              </div>
            </Draggable>
          )
        })}
      </div>
      <DropTarget
        onDropLeft={(dragItem) => addToList(dragItem, 0)}
        onDropRight={addToList} // adds item to the end
      >
        <div
          className={`donation-encourager__drop-target-container${
            moving ? " highlighted" : ""
          }`}
        >
          {selectedItems.map((item, i) => (
            <DropTarget
              key={i}
              onDropLeft={(dragItem) => addToList(dragItem, i)}
              onDropRight={(dragItem) => addToList(dragItem, i + 1)}
            >
              <Draggable dragData={item}>
                <div
                  className={`donation-encourager__item`}
                  onClick={() => removeFromList(item.uid)}
                >
                  {renderIcon(item.icon)}
                </div>
              </Draggable>
            </DropTarget>
          ))}
        </div>
      </DropTarget>
    </div>
  )
}

export default ItemSelector

function renderIcon(icon) {
  // return typeof icon === "object" ? <FontAwesomeIcon icon={icon} /> : icon
  return icon
}

import React from "react";
import "./drag-drop.scss";
// polyfill to enable html5 native drag&drop on touch devices
import { polyfill } from "mobile-drag-drop";
polyfill();

if (typeof window !== "undefined") {
  // workaround for iOS Safari (see https://github.com/timruffles/mobile-drag-drop/issues/77)
  window.addEventListener("touchmove", function() {}, { passive: false });
}

export const Draggable = ({ children, dragData, onDragStart, onDragEnd }) => (
  <div
    className="donation-encourager__draggable"
    draggable
    onDragStart={e => {
      if (typeof onDragStart === "function") onDragStart(e);
      e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
      e.currentTarget.style.cursor = "grabbing";
    }}
    onDragEnd={e => {
      e.currentTarget.style.cursor = "";
      if (typeof onDragEnd === "function") onDragEnd(e);
    }}
  >
    {children}
  </div>
);

export const DropTarget = ({ children, onDrop, onDropLeft, onDropRight }) => {
  const handleDrop = e => {
    e.stopPropagation();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const side = getDropSide(e);
    if (side === "left" && typeof onDropLeft === "function") onDropLeft(data);
    if (side === "right" && typeof onDropRight === "function")
      onDropRight(data);
    if (typeof onDrop === "function") onDrop(data);
  };
  return (
    <div
      className="donation-encourager__drop-target"
      // https://github.com/timruffles/mobile-drag-drop#polyfill-requires-dragenter-listener
      onDragEnter={e => e.preventDefault()}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

function getDropSide(e) {
  const dropX = e.clientX;
  const rect = e.target.getBoundingClientRect();
  const targetCenter = rect.x + rect.width / 2;
  return dropX >= targetCenter ? "right" : "left";
}

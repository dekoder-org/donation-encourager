import { useEffect } from "react";
// polyfill to enable html5 native drag&drop on touch devices
import { polyfill } from "mobile-drag-drop";

let _polyfill_applied = false;

export default function useMobileDragDropPolyfill(DRAGGABLE_CLASS) {
  useEffect(() => {
    if (_polyfill_applied) return;
    if (typeof document !== "undefined" && typeof window !== "undefined") {
      polyfill({
        // limit polyfill to dragabble class items
        dragStartConditionOverride: ev => {
          if (ev.target.parentNode.classList.contains(DRAGGABLE_CLASS)) return true;
          else return false;
        }
      });
      // workaround for iOS Safari (see https://github.com/timruffles/mobile-drag-drop/issues/77)
      window.addEventListener("touchmove", function() {}, { passive: false });
      _polyfill_applied = true;
    }
  }, []);
}
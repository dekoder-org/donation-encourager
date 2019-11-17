import { useContext, useMemo, useEffect } from "react";
import { Settings } from "../contexts";

// if a targetted article body has less than X blocks, don't use the "middle" position
export const MIN_BLOCKS_FOR_MIDDLE_POS_AND_BLUR = 4;

// creates wrapper elements for the boxes according to intrusiveness settings and inserts them at the predefined positions into targetted article bodies
export default function useBoxPositioner(intrusivenessProps, targets) {
  const settings = useContext(Settings);
  const boxes = useBoxWrappers(targets, intrusivenessProps, settings);
  return boxes;
}

function useBoxWrappers(targetElements, intrusivenessProps, settings) {
  const boxesWithWrappers = useMemo(() => {
    const { boxesEnabled, wrapperClass, excludeSelector } = settings;
    const { boxSettings, itemSelectorSettings } = intrusivenessProps;
    if (!boxesEnabled) return [];
    return targetElements.reduce((acc, targetElement) => {
      const boxesWithinTargetEl = (boxSettings || [])
        .map(b => {
          const wrapperEl = newWrapper(wrapperClass);
          const boxProps = {
            ...itemSelectorSettings,
            ...b,
            parentEl: targetElement,
            wrapperEl
          };
          const posNum = insertBoxWrapper(
            boxProps,
            wrapperClass,
            excludeSelector
          );
          if (!posNum) return null;
          return { ...boxProps, posNum };
        })
        .filter(b => b)
        .map((b, i) => {
          return { ...b, isFirst: i === 0 };
        });
      return [...acc, ...boxesWithinTargetEl];
    }, []);
  }, [targetElements, intrusivenessProps, settings]);
  useEffect(() => {
    return () => boxesWithWrappers.forEach(b => b.wrapperEl.remove());
  }, [boxesWithWrappers]);
  return boxesWithWrappers;
}

function newWrapper(wrapperClass) {
  let result = document.createElement("div");
  result.classList.add(wrapperClass);
  return result;
}

function insertBoxWrapper(box, wrapperClass, excludeSelector) {
  const siblings = getFilteredChildArray(
    box.parentEl,
    wrapperClass,
    excludeSelector
  );
  const posNum = positionNumber(box.position, siblings.length);
  if (!siblings.length || isNaN(posNum) || posNum > siblings.length) return;
  // if refrenceNode === null the element will be attached to the end
  const referenceNode =
    posNum === siblings.length
      ? siblings[posNum - 1].nextElementSibling // bottom pos
      : floatChecker(siblings, posNum);
  box.parentEl.insertBefore(box.wrapperEl, referenceNode);
  return posNum;
}

function positionNumber(positionString, siblingsCount) {
  switch (positionString) {
    case "bottom":
      return siblingsCount;
    case "top":
      return 0;
    case "middle":
      return siblingsCount >= MIN_BLOCKS_FOR_MIDDLE_POS_AND_BLUR
        ? Math.floor(siblingsCount / 2)
        : siblingsCount + 1; // => won't be rendered
    default:
      return parseInt(positionString);
  }
}

export function getFilteredChildArray(parentEl, filterClass, excludeSelector) {
  const excludeEls = excludeSelector
    ? Array.from(parentEl.querySelectorAll(excludeSelector))
    : [];
  return Array.from(parentEl.children)
    .filter(el => (filterClass ? !el.classList.contains(filterClass) : el))
    .filter(el => !excludeEls.includes(el));
}

const MAX_FLOAT_CHECKER_ITERATIONS = 3;
// check that previous element has no float
function floatChecker(siblings, posNum, iteration = 1) {
  const referenceNode = siblings[posNum];
  const prevEl = referenceNode ? referenceNode.previousElementSibling : null;
  if (!prevEl) return referenceNode;
  // if prevEl has float, try next sibling
  const compFloat = window.getComputedStyle(prevEl).float;
  if (compFloat === "left" || compFloat === "right") {
    if (iteration <= MAX_FLOAT_CHECKER_ITERATIONS)
      return floatChecker(siblings, posNum + 1, iteration + 1);
    else return siblings[posNum + 1];
  } else return referenceNode;
}

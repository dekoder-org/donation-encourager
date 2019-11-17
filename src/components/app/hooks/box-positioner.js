import { useContext, useMemo, useEffect } from "react";
import { Settings } from "../contexts";

// if a targetted article body has less than X blocks, don't use the "middle" position
export const MIN_BLOCKS_FOR_MIDDLE_POS_AND_BLUR = 4;

// creates wrapper elements for the boxes according to intrusiveness settings and inserts them at the predefined positions into targetted article bodies
export default function useBoxPositioner(intrusivenessProps, targets) {
  const settings = useContext(Settings);
  const { boxSettings, itemSelectorSettings } = intrusivenessProps;
  const boxes = useBoxWrappers(targets, boxSettings, settings);
  const boxesWithItemSelectorSettings = useMemo(
    () => boxes.map(b => ({ ...b, itemSelectorSettings })),
    [boxes, itemSelectorSettings]
  );
  return boxesWithItemSelectorSettings;
}

function useBoxWrappers(targetElements, boxSettings, settings) {
  const boxesWithWrappers = useMemo(() => {
    const { boxesEnabled, wrapperClass, excludeSelector } = settings;
    if (!boxesEnabled) return [];
    return targetElements.reduce((acc, targetEl) => {
      const boxesWithinTargetEl = (boxSettings || [])
        .map(b => ({ ...b, targetEl, wrapperEl: newWrapper(wrapperClass) }))
        .map(b => addBoxWrapper(b, wrapperClass, excludeSelector))
        .filter(b => b.posNum)
        .map((b, i) => ({ ...b, isFirst: i === 0 }));
      return [...acc, ...boxesWithinTargetEl];
    }, []);
  }, [targetElements, boxSettings, settings]);
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

function addBoxWrapper(box, wrapperClass, excludeSelector) {
  const { targetEl, wrapperEl, position } = box;
  const siblings = getChildArray(targetEl, wrapperClass, excludeSelector);
  const posNum = positionNumber(position, siblings.length);
  if (!siblings.length || isNaN(posNum) || posNum > siblings.length) return box;
  const referenceNode =
    posNum === siblings.length
      ? siblings[posNum - 1].nextElementSibling // bottom pos
      : floatChecker(siblings, posNum);
  // if refrenceNode === null the element will be attached to the end
  targetEl.insertBefore(wrapperEl, referenceNode);
  return { ...box, posNum };
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

export function getChildArray(parentEl, filterClass, excludeSelector) {
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

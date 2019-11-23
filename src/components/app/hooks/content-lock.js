import { useContext, useState, useEffect, useMemo } from "react";
import { Settings } from "../contexts";
import { getChildArray } from "./box-positioner";
import "./content-lock.scss";

const BLUR_CLASS = "donation-encourager__lock-content";
const BLUR_CLASS_ACTIVE = "lock-active";
const GRADIENT_CLASS = "donation-encourager__gradient-content";
const GRADIENT_CLASS_ACTIVE = "gradient-active";

// gives gradient to last content block before 1st donation encourager box
// + blur for all following content blocks
export default function useContentLock({ contentLockEnabled }, targets) {
  const { boxesEnabled, wrapperClass } = useContext(Settings);
  const isInitiallyActive = contentLockEnabled && boxesEnabled;
  const [contentLockActive, setContentLockActive] = useState(isInitiallyActive);
  useEffect(() => setContentLockActive(isInitiallyActive), [isInitiallyActive]);
  const unlockContent = () => setContentLockActive(false);

  const blurEls = useChildReducer(targets, wrapperClass, blurElGetter);
  useClass(blurEls, true, BLUR_CLASS);
  useClass(blurEls, contentLockActive, BLUR_CLASS_ACTIVE);

  const gradientEls = useChildReducer(targets, wrapperClass, gradientElGetter);
  useClass(gradientEls, true, GRADIENT_CLASS);
  useClass(gradientEls, contentLockActive, GRADIENT_CLASS_ACTIVE);

  return [contentLockActive, unlockContent];
}

function useClass(elements, active, className) {
  useEffect(() => {
    elements.forEach(el => (active ? el.classList.add(className) : ""));
    return () => {
      elements.forEach(el => el.classList.remove(className));
    };
  }, [elements, active, className]);
}

function blurElGetter(acc, allChildren, firstBoxIndex, wrapperClass) {
  const childrenAfterFirstBox = allChildren
    .slice(firstBoxIndex)
    .filter(el => !el.classList.contains(wrapperClass));
  return [...acc, ...childrenAfterFirstBox];
}

function gradientElGetter(acc, allChildren, firstBoxIndex) {
  const isFirstBoxLast = firstBoxIndex === allChildren.length - 1;
  const lastBefore = allChildren[firstBoxIndex - 1];
  return lastBefore && !isFirstBoxLast ? [...acc, lastBefore] : acc;
}

function useChildReducer(targetElements, wrapperClass, reducer) {
  return useMemo(() => {
    return targetElements.reduce((acc, targetElement) => {
      const allChildren = getChildArray(targetElement);
      const firstBox = allChildren.find(c =>
        c.classList.contains(wrapperClass)
      );
      const firstBoxIndex = allChildren.indexOf(firstBox);
      return reducer(acc, allChildren, firstBoxIndex, wrapperClass);
    }, []);
  }, [targetElements, wrapperClass, reducer]);
}

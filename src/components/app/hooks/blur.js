import { useContext, useState, useEffect, useMemo } from "react";
import { Settings } from "../contexts";
import { getFilteredChildArray } from "./box-positioner";
import "./blur.scss";

const BLUR_CLASS = "donation-encourager__blur-content";
const BLUR_CLASS_ACTIVE = "blur-active";
const GRADIENT_CLASS = "donation-encourager__gradient-content";
const GRADIENT_CLASS_ACTIVE = "gradient-active";

// gives gradient to last content block before 1st donation encourager box
// + blur for all following content blocks
export default function useBlur({ blurEnabled }, updateTrigger) {
  const { boxesEnabled } = useContext(Settings);
  const [blurActive, removeBlur] = useBlurState(blurEnabled, boxesEnabled);
  useBlurEffect(blurActive, updateTrigger);
  useGradientEffect(blurActive, updateTrigger);
  return [blurActive, removeBlur];
}

function useBlurState(blurEnabled, boxesEnabled) {
  const isInitiallyActive = blurEnabled && boxesEnabled;
  const [blurActive, setBlurActive] = useState(isInitiallyActive);
  useEffect(() => setBlurActive(isInitiallyActive), [isInitiallyActive]);
  const removeBlur = () => setBlurActive(false);
  return [blurActive, removeBlur];
}

function useBlurEffect(blurActive, updateTrigger) {
  const blurEls = useElementGetter(getBlurElements, updateTrigger);
  useClassToggle(blurEls, true, BLUR_CLASS);
  useClassToggle(blurEls, blurActive, BLUR_CLASS_ACTIVE);
}

function useGradientEffect(blurActive, updateTrigger) {
  const gradientEls = useElementGetter(getGradientElements, updateTrigger);
  useClassToggle(gradientEls, true, GRADIENT_CLASS);
  useClassToggle(gradientEls, blurActive, GRADIENT_CLASS_ACTIVE);
}

function useElementGetter(elementGetter, updateTrigger) {
  const { targetSelector, wrapperClass } = useContext(Settings);
  const elements = useMemo(() => {
    const targetEls = Array.from(document.querySelectorAll(targetSelector));
    return elementGetter(targetEls, wrapperClass);
  }, [targetSelector, wrapperClass, updateTrigger]);
  return elements;
}

function useClassToggle(elements, active, className) {
  useEffect(() => {
    if (active) {
      elements.forEach(el => el.classList.add(className));
    }
    return () => {
      elements.forEach(el => el.classList.remove(className));
    };
  }, [elements, active, className]);
}

function getBlurElements(targetElements, wrapperClass) {
  return targetElements.reduce((acc, targetElement) => {
    const allChildren = getFilteredChildArray(targetElement);
    const firstBox = allChildren.find(c => c.classList.contains(wrapperClass));
    const firstBoxIndex = allChildren.indexOf(firstBox);
    const childrenAfterFirstBox = allChildren
      .slice(firstBoxIndex)
      .filter(el => !el.classList.contains(wrapperClass));
    return [...acc, ...childrenAfterFirstBox];
  }, []);
}

function getGradientElements(targetElements, wrapperClass) {
  return targetElements.reduce((acc, targetElement) => {
    const allChildren = getFilteredChildArray(targetElement);
    const firstBox = allChildren.find(c => c.classList.contains(wrapperClass));
    const firstBoxIndex = allChildren.indexOf(firstBox);
    const isFirstBoxLast = firstBoxIndex === allChildren.length - 1;
    const lastBefore = allChildren[firstBoxIndex - 1];
    return lastBefore && !isFirstBoxLast ? [...acc, lastBefore] : acc;
  }, []);
}

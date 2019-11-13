import { useContext, useState, useEffect } from "react";
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
  const { boxesEnabled, targetSelector, wrapperClass } = useContext(Settings);
  const [blurActive, removeBlur] = useBlurState(blurEnabled, boxesEnabled);
  useBlurEffect(blurActive, targetSelector, wrapperClass, updateTrigger);
  useGradientEffect(blurActive, targetSelector, wrapperClass, updateTrigger);
  return [blurActive, removeBlur];
}

function useBlurState(blurEnabled, boxesEnabled) {
  const isInitiallyActive = blurEnabled && boxesEnabled;
  const [blurActive, setBlurActive] = useState(isInitiallyActive);
  useEffect(() => setBlurActive(isInitiallyActive), [isInitiallyActive]);
  const removeBlur = () => setBlurActive(false);
  return [blurActive, removeBlur];
}

function useBlurEffect(
  blurActive,
  targetSelector,
  wrapperClass,
  updateTrigger
) {
  useEffect(() => {
    const blurEls = getBlurElements(targetSelector, wrapperClass);
    blurEls.forEach(el => el.classList.add(BLUR_CLASS));
    if (blurActive) {
      blurEls.forEach(el => el.classList.add(BLUR_CLASS_ACTIVE));
    }
    return () => {
      blurEls.forEach(el => el.classList.remove(BLUR_CLASS));
      blurEls.forEach(el => el.classList.remove(BLUR_CLASS_ACTIVE));
    };
  }, [blurActive, targetSelector, wrapperClass, updateTrigger]);
}

function useGradientEffect(
  blurActive,
  targetSelector,
  wrapperClass,
  updateTrigger
) {
  useEffect(() => {
    const gradientEls = getGradientElements(targetSelector, wrapperClass);
    gradientEls.forEach(el => el.classList.add(GRADIENT_CLASS));
    if (blurActive) {
      gradientEls.forEach(el => el.classList.add(GRADIENT_CLASS_ACTIVE));
    }
    return () => {
      gradientEls.forEach(el => el.classList.remove(GRADIENT_CLASS));
      gradientEls.forEach(el => el.classList.remove(GRADIENT_CLASS_ACTIVE));
    };
  }, [blurActive, targetSelector, wrapperClass, updateTrigger]);
}

function getBlurElements(targetSelector, wrapperClass) {
  const targetElements = Array.from(document.querySelectorAll(targetSelector));
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

function getGradientElements(targetSelector, wrapperClass) {
  const targetElements = Array.from(document.querySelectorAll(targetSelector));
  return targetElements.reduce((acc, targetElement) => {
    const allChildren = getFilteredChildArray(targetElement);
    const firstBox = allChildren.find(c => c.classList.contains(wrapperClass));
    const firstBoxIndex = allChildren.indexOf(firstBox);
    const isFirstBoxLast = firstBoxIndex === allChildren.length - 1;
    const lastBefore = allChildren[firstBoxIndex - 1];
    return lastBefore && !isFirstBoxLast ? [...acc, lastBefore] : acc;
  }, []);
}

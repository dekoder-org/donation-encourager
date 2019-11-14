import React from "react";
import Odometer from "./odometer-ssr-safe";
import { useInView } from "react-intersection-observer";
import "./odometer-theme-minimal.css";

const Counter = ({ value }) => {
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true
  });

  return (
    <div ref={ref}>
      <Odometer
        value={inView ? value : 0}
        format="(.ddd)"
        duration={5000}
        theme="minimal"
      />
    </div>
  );
};

export default Counter;

import React, { useEffect } from "react";
// import Odometer from "react-odometerjs";

// placeholder for SSR
let Odometer = ({ value }) => <div>{value}</div>;

let _odometer_import_triggered = false;

const OdometerSsrSafe = props => {
  useEffect(() => {
    if (_odometer_import_triggered) return;
    else {
      _odometer_import_triggered = true;
      // dynamic import of odometer
      import("react-odometerjs").then(module => {
        Odometer = module.default;
      });
    }
  }, []);
  return <Odometer {...props} />;
};

export default OdometerSsrSafe;

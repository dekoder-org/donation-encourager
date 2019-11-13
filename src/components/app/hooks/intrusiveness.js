import { useContext, useMemo } from "react";
import { Settings, Storage } from "../contexts";

// returns settings according to current intrusiveness level
function useIntrusiveness() {
  const { intrusivenessLevels } = useContext(Settings);
  const { totalContents } = useContext(Storage);
  const currentSettings = useMemo(() => {
    return intrusivenessLevels
      .sort((a, b) => a.contentThreshold - b.contentThreshold)
      .reduce((acc, curr) => {
        return totalContents >= curr.contentThreshold ? curr : acc;
      }, {});
  }, [intrusivenessLevels, totalContents]);
  return currentSettings;
}

export default useIntrusiveness;

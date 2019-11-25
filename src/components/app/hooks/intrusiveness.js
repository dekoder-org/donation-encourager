import { useContext, useMemo } from "react";
import { Settings, Storage } from "../contexts";
import { ts } from "./site-actions";

const MEMBER_GRACE_PERIOD = 30; // in days

// returns settings according to current intrusiveness level
function useIntrusiveness() {
  const { intrusivenessLevels } = useContext(Settings);
  const { totalContents, memberValidation } = useContext(Storage);
  const isValidatedMember = useValidation(memberValidation);
  const currentSettings = useMemo(() => {
    if (isValidatedMember) return intrusivenessLevels[0];
    return intrusivenessLevels
      .sort((a, b) => a.contentThreshold - b.contentThreshold)
      .reduce((acc, curr) => {
        return totalContents >= curr.contentThreshold ? curr : acc;
      }, {});
  }, [intrusivenessLevels, totalContents, isValidatedMember]);
  return currentSettings;
}

export default useIntrusiveness;

function useValidation(memberValidation = 0) {
  return useMemo(() => {
    const gracePeriod = daysToMs(MEMBER_GRACE_PERIOD);
    return memberValidation >= ts() - gracePeriod ? true : false;
  }, [memberValidation]);
}

function daysToMs(days) {
  return days * 24 * 60 * 60 * 1000;
}

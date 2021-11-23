import { useCellsBy } from "..";
import { LAST_ROW_INDEX } from "../../constants";

const useContributions = sheetData => {
  const contributionData = useCellsBy(sheetData, { byIndex: 'F', rangeStartIndex: 2, rangeEndIndex: LAST_ROW_INDEX });

  if (sheetData.loading) {
    return ['Loading'];
  }

  if (sheetData.result) {
    return contributionData.filter(({ value }) => value).map(({ value }) => value);
  }
}

export default useContributions;

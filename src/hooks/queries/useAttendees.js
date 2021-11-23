import { useCellsBy } from "..";
import { LAST_ROW_INDEX } from "../../constants";

const useAttendees = sheetData => {
  const attendeeData = useCellsBy(sheetData, { byIndex: 'B', rangeStartIndex: 2, rangeEndIndex: LAST_ROW_INDEX });

  if (sheetData.loading) {
    return ['Loading'];
  }

  if (sheetData.result) {
    return attendeeData.filter(({ value }) => value).map(({ value }) => value);
  }
}

export default useAttendees;

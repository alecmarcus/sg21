import { stringToNumber, sanitizeCoords } from "./utils";

// const columnC = useCellsBy(sheetData, { byIndex: 'C', rangeStartIndex: 0, rangeEndIndex: 10 });
// const row4 = useCellsBy(sheetData, { by: 'row', byIndex: 3, rangeStartIndex: 0, rangeEndIndex: 10 });

const useCellsBy = (sheetData, options) => {
  if (sheetData.loading) {
    return [];
  }

  if (sheetData.error) {
    console.error(sheetData.error);
    return [];
  }

  if (sheetData.result) {
    const values = [];
    const { by, byIndex, rangeStartIndex, rangeEndIndex } = options;

    for (let i = stringToNumber(rangeStartIndex); i < stringToNumber(rangeEndIndex); i++) {
      const cellCoordinates = sanitizeCoords([i, byIndex]); // default to column

      if (by === 'row') {
        cellCoordinates.reverse();
      }

      values.push(sheetData.result.getCell(...cellCoordinates));
    }

    return values;
  }
}

export default useCellsBy;

import { sanitizeCoords } from "./utils";

// [Column, Row]
// const b11 = useCellData(sheetData, ['B', 11]);
// const a3 = useCellData(sheetData, [0, 2]);

const useCellData = (sheetData, cellCoordinates) => {
  if (sheetData.loading) {
    return 'Loading';
  }

  if (sheetData.error) {
    console.error(sheetData.error);
    return 'Error';
  }

  if (sheetData.result) {
    return sheetData.result.getCell(...(sanitizeCoords(cellCoordinates).reverse()));
  }
}

export default useCellData;

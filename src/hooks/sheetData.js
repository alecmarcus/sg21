import { GoogleSpreadsheet } from "google-spreadsheet";
import { useAsync } from 'react-async-hook';

const useSheetData = () => {
  const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
  const SHEET_ID = process.env.REACT_APP_SHEET_ID;
  const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
  const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  const fetchSheetData = useAsync(async () => {
    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      });

      // loads document properties and worksheets
      await doc.loadInfo();

      const sheet = doc.sheetsById[SHEET_ID];

      await sheet.loadCells();

      return sheet;

    } catch (e) {
      console.error('Error: ', e);
      return null;
    }
  });

  return fetchSheetData;
}

export default useSheetData;

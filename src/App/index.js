import styles from './app.module.scss';
import { useSheetData } from '../hooks';
import { useAttendees, useContributions } from "../hooks/queries";
import { PeopleList, Main } from "../components";

function App() {
  const sheetData = useSheetData();
  const attendees = useAttendees(sheetData);
  const contributions = useContributions(sheetData);

  return (
    <main className={styles.app}>
      <Main />
      <PeopleList attendees={attendees} contributions={contributions} loading={sheetData.loading} />
    </main>
  );
};

export default App;

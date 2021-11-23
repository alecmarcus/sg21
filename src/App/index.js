import { useState, useRef } from "react";
import styles from './app.module.scss';
import { useSheetData } from '../hooks';
import { useAttendees, useContributions } from "../hooks/queries";
import { PeopleList, Main, Skype } from "../components";

function App() {
  const sheetData = useSheetData();
  const attendees = useAttendees(sheetData);
  const contributions = useContributions(sheetData);

  const [showLogin, setShowLogin] = useState(true);
  const [showApp, setShowApp] = useState(false);
  const appRef = useRef(null);
  const loginScreenRef = useRef(null);

  const authorize = ({ target: { value: password }}) => {
    if (password === process.env.REACT_APP_PASSWORD) {
      loginScreenRef.current.classList.add(styles.leave);
      setShowApp(true);

      setTimeout(() => {
        setShowLogin(false);
      }, 400);
    }
  }

  return (
    <>
      {showApp && (
        <main className={styles.app} ref={appRef}>
          <Main />
          <PeopleList attendees={attendees} contributions={contributions} loading={sheetData.loading} />
        </main>
      )}
      {showLogin && (
        <div className={styles.loginScreen} ref={loginScreenRef}>
          <h1 className={styles.title}><span className={styles.noThanks}>Thanks<Skype className={styles.skype}/></span>giving</h1>
          <p className={styles.year}>2021</p>
          <form className={styles.passwordForm}>
            <input placeholder="Password" type="password" name="password" id="password" onChange={authorize}  className={styles.passwordInput}/>
          </form>
        </div>
      )}
    </>
  );
};

export default App;

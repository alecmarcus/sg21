import { useEffect, useState, useCallback } from "react";
import { DATE } from "../../constants";
import styles from "./countdown.module.scss";

const Countdown = () => {
  const zero = (n) => (n < 10? '0' : '') + n; // Add a leading zero to single digit numbers

  const getTimeUntil = useCallback(() => {
    let diff = DATE - new Date();

    const totalHours = diff / 3.6e6 | 0;
    const days = totalHours / 24 | 0;
    const hours = totalHours % 24;
    const mins  = diff % 3.6e6 / 6e4 | 0;
    const secs  = Math.round(diff % 6e4 / 1e3);

    return `${zero(days)}D ${zero(hours)}H ${zero(mins)}M ${zero(secs)}S`;
  }, []);

  const [timeUntil, setTimeUntil] = useState(getTimeUntil());

  const formatDate = (d) => (
    new Intl.DateTimeFormat(
      'en-US',
      {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'America/New_York',
      }
    ).format(d)
  )

  useEffect(() => {
    DATE - new Date() > 0
      ? setInterval(() => setTimeUntil(getTimeUntil()), 1000)
      : setTimeUntil('COMPLETE');
  }, [getTimeUntil]);

  return (
    <a
      href="http://www.google.com/calendar/event?action=TEMPLATE&dates=20211127T230000Z%2F20211128T40000Z&text=Skypesgiving&location=25%20Standish%20Road%2C%20Ellington%20CT%2006029&details=Please%20join%20us%20for%20a%20rarified%20evening%20of%20offline%20festivities%20in%20which%20we%20give%20skypes%20and%20celebrate%20each%20other's%20company."
      rel="noopener noreferrer"
      target="_blank"
      className={styles.calLink}
    >
      <time dateTime={DATE} className={styles.time}>
        <span className={styles.countdown}>
          in T - {timeUntil}
        </span>
        <span className={styles.date}>
          on {formatDate(DATE)}
        </span>
      </time>
    </a>
  );
};

export default Countdown;

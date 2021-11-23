import { Countdown, Compass, Skype } from "../";
import styles from "./main.module.scss";

const Main = () => {
  return (
    <section className={styles.main}>
      <p className={styles.text}>
        Please join us for a rarified evening of <em>offline</em> festivities in which we give <span className={styles.noThanks}>thanks<Skype className={styles.skype}/></span> and celebrate each other's company. Ceremonies will be held at <a href="https://goo.gl/maps/ah5cEtMiEtTFQx6x6" target="_blank" rel="noopener noreferrer">25 Standish Road, in Ellington, CT</a> <span className={styles.compassWrapper}>(<Compass/>)</span>, and are scheduled to commence <Countdown />.
      </p>
    </section>
  );
};

export default Main;

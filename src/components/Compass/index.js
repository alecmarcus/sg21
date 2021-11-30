import { useEffect, useState, useCallback, useRef } from "react";
import { DESTINATION_COORDS } from "../../constants";
import { useAnimation } from "../../hooks";
import styles from "./compass.module.scss";

const Compass = () => {
  const [visitorCoords, updateVisitorCoords] = useState(null);
  const [heading, setHeading] = useState(0);

  const success = ({ coords }) => updateVisitorCoords(coords);
  const error = () => console.warn('Unable to retrieve your location');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  const getHeading = useCallback((origin, destination) => {
    const DMStoDD = (DMS) => {
      const deg = parseFloat(DMS.slice(0, 2));
      const min = parseFloat(DMS.slice(DMS.indexOf('°') + 1, DMS.indexOf(`'`)));
      const sec = parseFloat(DMS.slice(DMS.indexOf(`'`) + 1, DMS.indexOf(`"`)));
      const dir = DMS.slice(-1);

      let dd = deg + (min / 60) + (sec / (60 * 60));

      if (dir === "S" || dir === "W") {
        dd *= -1;
      } // Don't do anything for N or E

      return dd;
    }

    const dx = DMStoDD(destination.longitude) - origin.longitude;
    const dy = DMStoDD(destination.latitude) - origin.latitude;
    const angle = -1 * Math.atan2(dy, dx) * 180 / Math.PI;

    return angle;
  }, []);

  const easeOutElastic = (x) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }

  const compassRef = useRef(null);
  const [headingAnimation, headingAnimationState] = useAnimation({
    node: compassRef,
    to: { transform: `rotate(${heading}deg)` },
    duration: 6000,
    ease: easeOutElastic,
  });

  useEffect(() => {
    if (visitorCoords) {
      setHeading(getHeading(visitorCoords, DESTINATION_COORDS));
    };
  }, [visitorCoords, getHeading]);

  useEffect(() => {
    if (heading !== 0 && compassRef.current && headingAnimationState === 'NOT_STARTED') {
      headingAnimation();
    }
  }, [heading, headingAnimation, headingAnimationState]);

  const formattedCoord = (coord) =>
    `${coord.slice(0, coord.indexOf(`'`) + 1)} ${coord.slice(coord.indexOf(`'`) + 2, coord.length + 1)}`;

  return (
    <span className={styles.compass} ref={compassRef}>
      <span className={styles.lat}>{formattedCoord(DESTINATION_COORDS.latitude)}</span>
      <span className={styles.long}>{formattedCoord(DESTINATION_COORDS.longitude)}</span>
    </span>
  );
};

export default Compass;

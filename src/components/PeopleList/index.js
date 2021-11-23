import { useState, useEffect, useCallback } from "react";
import styles from "./peopleList.module.scss";

const PeopleList = ({ attendees, contributions, loading }) => {
  // Wrap in useCallback for a consistent reference that doesn't
  // cause re-renders when listed as a dependency of useEffect
  const getAllPeople = useCallback(
    () => attendees.map((name, i) => ({ name, contributions: contributions[i] })),
    [attendees, contributions]
  );

  const [filteredPeople, setFilteredPeople] = useState([]);

  const filterPeople = ( { target: { value: filter } } ) => {
    const filteredPeople = getAllPeople().filter(({ name, contributions }) =>
      name?.toLowerCase().includes(filter.toLowerCase())
        || contributions?.toLowerCase().includes(filter.toLowerCase())
    );

    const results = filteredPeople.length ? filteredPeople : [{ name: 'Nobody', contributions: 'Nothing' }];

    setFilteredPeople(results);
  };

  // Update data once loaded
  useEffect(() => {
    setFilteredPeople(getAllPeople());
  }, [loading, getAllPeople]);

  const scrollToPeopleList = ({ target }) => {
    window.scrollTo({
      top: target.getBoundingClientRect().top,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          Loading guest list...
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <form className={styles.filterWrapper}>
          <input
            type="search"
            name="filterPeople"
            id="filterPeople"
            placeholder="Attendees"
            onInput={filterPeople}
            className={`${styles.filter} ${filteredPeople.length < getAllPeople().length ? styles.hasValue : ''}`}
            onClick={scrollToPeopleList}
          />
          <svg className={styles.searchIcon} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M1.3 6C1.3 8.59574 3.40426 10.7 6 10.7C8.59574 10.7 10.7 8.59574 10.7 6C10.7 3.40426 8.59574 1.3 6 1.3C3.40426 1.3 1.3 3.40426 1.3 6ZM0 6C0 9.31371 2.68629 12 6 12C7.4227 12 8.72975 11.5048 9.7582 10.6774L13.5404 14.4596L14.4596 13.5404L10.6774 9.7582C11.5048 8.72975 12 7.4227 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6Z" />
          </svg>
        </form>
        <ul>
          {filteredPeople.map(({ name, contributions }, i) => (
            <li key={`person-${i}`} className={styles.person}>
              <p className={styles.name}>
                {name}
              </p>
              <p className={styles.contributions}>
                {contributions}
              </p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
};

export default PeopleList;

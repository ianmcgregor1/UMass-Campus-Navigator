import React from 'react';
import styles from './nav.module.scss'
import { Link } from "react-router-dom";

/**
 * This is the NavBar component that provides navigation links to different pages.
 * Should be updated whenever new pages are added to the application.
 * @returns NavBar component
 */
const NavBar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.navItem}>
        <Link to='/'>
          <button className={styles.navLink}>
            Home
          </button>
        </Link>
      </div>
      <div className={styles.navItem}>
        <Link to='/schedule-builder'>
          <button className={styles.navLink}>
            Schedule Builder
          </button>
        </Link>
      </div>
      <div className={styles.navItem}>
        <Link to='/account'>
          <button className={styles.navLink}>
            Account
          </button>
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
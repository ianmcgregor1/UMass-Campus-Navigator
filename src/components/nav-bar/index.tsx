import React from 'react';
import styles from './nav.module.scss'
import { Link } from "react-router-dom";


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
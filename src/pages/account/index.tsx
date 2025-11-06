
import React from 'react';
import styles from './account.module.scss';

function AccountPage() {
  return (
    <div className={styles.page}>
      <div className={styles.accountNAV}>
        
        <div className={styles.navLeft}>
          <h2>Account Details</h2>
        </div>

        <div className={styles.navRight}>
          <button className={styles.navButton}>Edit Profile</button>
          <button className={styles.navButton}>Settings</button>
          <button className={styles.navButton}>Help</button>
        </div>
      </div>

      <div className={styles.profileContainer}>
        <div className={styles.profileArea}>
          <img src="/Default-pfp.png" alt="" className={styles.profilePic} />
          <div className={styles.username}>
            Username goes here.
          </div>
        </div>

        <div className={styles.contentArea}>
          <h3>Account Overview</h3>

          <p>Here's where you can see your current schedule.</p>
          <button className={styles.contentButton}>Your Schedule</button>

          <p>Here's where you can see your previous routes.</p>
          <button className={styles.contentButton}>Your Routes</button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
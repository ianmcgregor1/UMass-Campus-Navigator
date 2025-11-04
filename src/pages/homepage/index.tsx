
import React from 'react';
import styles from './home.module.scss';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

const apiKey = process.env.REACT_APP_API_KEY;

function HomePage() {
  return (
    <div className={styles.border}>
      <div className={styles.container}>
        <div className={styles.title}>
          Start Planning Your Route:

        </div>
        <div className={styles.content}>

          <div className={styles.mapContainer}>
            <div className={styles.routeSelector}>
              Select a route...
            </div>
            <div className={styles.map}>
              {<APIProvider apiKey={apiKey || ''}>
                <Map
                  style={{width: '100%', height: '100%'}}
                  defaultCenter={{lat: 42.389971817134544, lng: -72.52622911098678}}
                  defaultZoom={16}
                  gestureHandling='greedy'
                  disableDefaultUI
                />
              </APIProvider>}
            </div>
          </div>
          <div className={styles.routeCreator}>
            Create a new route:
            <div className={styles.addStopButtons}>

            </div>
            <div className={styles.routeButtons}>

            </div>
          </div>

        </div>
        <div className={styles.routeInfo}>
          ETA:...
        </div>
      </div>
    </div>
  );
}

export default HomePage;
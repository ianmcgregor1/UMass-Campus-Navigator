
import React, { useState } from 'react';
import styles from './home.module.scss';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import { Route } from '../../models/route';



export default function HomePage() {

  const apiKey = process.env.REACT_APP_API_KEY;
  const mockRoutes = [
    { id: 1, name: 'Route 1', stops: [0, 1, 2] },
    { id: 2, name: 'Route 2', stops: [2, 3, 4] },
  ];
  const mocklocations = [
    { id: 0, name: 'Location 1', location: { lat: 42.389971817134544, lng: -72.52622911098678 }, type: 'academic' },
    { id: 1, name: 'Location 2', location: { lat: 42.3908, lng: -72.5267 }, type: 'academic' },
    { id: 2, name: 'Location 3', location: { lat: 42.3914, lng: -72.5258 }, type: 'academic' },
    { id: 3, name: 'Location 4', location: { lat: 42.3900, lng: -72.5289 }, type: 'academic' },
    { id: 4, name: 'Location 5', location: { lat: 42.3925, lng: -72.5242 }, type: 'residential' },
  ];

  const [selectedRoute, setSelectedRoute] = useState<Route | undefined>();
  const [selectedStops, setSelectedStops] = useState<Array<number>>([0,1,2]);

  function upButtonClick(index: number) {
    if (index === 0) return;
    const newStops = [...selectedStops];
    [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    setSelectedStops(newStops);
  }
  function downButtonClick(index: number) {
    if (index === selectedStops.length-1) return;
    const newStops = [...selectedStops];
    [newStops[index + 1], newStops[index]] = [newStops[index], newStops[index + 1]];
    setSelectedStops(newStops);  
  }

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
            <div className={styles.stopsList}>
              {selectedStops.map((stopId, index) => (
                <div key={index} className={styles.stop}>
                  <div className={styles.stopInfo}>
                    <div className={styles.stopName}>
                      {mocklocations.find(loc => loc.id === stopId)?.name || 'Unknown Location'}
                    </div>
                    <div className={styles.stopType}>
                      {mocklocations.find(loc => loc.id === stopId)?.type || 'Unknown'}
                    </div>
                  </div>
                  <div className={styles.reorderButtons}>
                    <button className={styles.upButton} disabled={index === 0} onClick={() => upButtonClick(index)}>↑</button>
                    <button className={styles.downButton} disabled={index === selectedStops.length-1} onClick={() => downButtonClick(index)}>↓</button>
                  </div>
                  <div className={styles.otherButtons}>
                    <button className={styles.removeButton}>Remove</button>
                  </div>
                </div>
              ))}
              <div className={styles.addStopContainer}>
                <button className={styles.addStopButton}>+ Add Stop</button>
              </div>
            </div>
            <div className={styles.routeButtons}>
              <button className={styles.routeButton}>Start ›</button>
              <button className={styles.saveButton}>Save Route</button>
            </div>
            <div className={styles.routeInfo}>
              ETA:...
            </div>
          </div>

        </div> 
      </div>
    </div>
  );
}
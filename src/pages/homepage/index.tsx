
import React, { useEffect, useState } from 'react';
import styles from './home.module.scss';
import { APIProvider, Map, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Route } from '../../models/route';
import { Location } from '../../models/location';
import Select from 'react-select';
import Directions from '../../components/directions';

/**
 * This is the HomePage component that serves as the main interface for users to plan routes on campus.
 * It is both the landing page for the application and the page where users can create and view routes.
 * @returns home page component
 */
export default function HomePage() {

  const apiKey = process.env.REACT_APP_API_KEY;

  const mockRoutes = [
    { id: 1, name: 'Route 1', stops: [0, 1, 2] },
    { id: 2, name: 'Route 2', stops: [2, 3, 4] },
  ] as Route[];

  const mockLocations = [
    { id: 0, name: 'Location 1', location: { lat: 42.389971817134544, lng: -72.52622911098678 }, type: 'academic' },
    { id: 1, name: 'Location 2', location: { lat: 42.3908, lng: -72.5267 }, type: 'academic' },
    { id: 2, name: 'Location 3', location: { lat: 42.3914, lng: -72.5258 }, type: 'academic' },
    { id: 3, name: 'Location 4', location: { lat: 42.3900, lng: -72.5289 }, type: 'academic' },
    { id: 4, name: 'Location 5', location: { lat: 42.3925, lng: -72.5242 }, type: 'residential' },
  ] as Location[];

  const [savedRoutes, setSavedRoutes] = useState<Array<Route>>([]);
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [currentRoute, setCurrentRoute] = useState<Route | undefined>();
  const [selectedStops, setSelectedStops] = useState<Array<number>>([0,1,2]);
  const [departureTime, setDepartureTime] = useState<string>(Date.now().toString());
  const [routeSelected, setRouteSelected] = useState<boolean>(false);
  const [locationsToShow, setLocationsToShow] = useState<Location[]>([]);
  const [showDirections, setShowDirections] = useState<boolean>(false);

  const mapOptions = {
    style: {width: '100%', height: '100%'},
    defaultCenter: {lat: 42.389971817134544, lng: -72.52622911098678},
    defaultZoom: 16,
    gestureHandling: 'greedy',
    disableDefaultUI: true
  }

  /*const routeOptions = {
    travelMode: 'WALK',
    polylineQuality: 'HIGH_QUALITY',
    computeAlternativeRoutes: false,
    units: 'IMPERIAL'
  };*/

  useEffect(() => {
    // Load saved routes on page load, or whenever something in the dependency array changes
    //TODO: replace with real data fetching from backend
    setSavedRoutes(mockRoutes);
  }, [/* Dependancy array */]);

  useEffect(() => {
    // Load saved locations on page load, or whenever something in the dependency array changes
    //TODO: replace with real data fetching from backend
    setLocations(mockLocations);
  }, [/* Dependancy array */]);


  /**
   * Function to handle up button click for reordering stops
   * @param index the index of the stop
   */
  function upButtonClick(index: number) {
    if (index === 0) return;
    const newStops = [...selectedStops];
    [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    setSelectedStops(newStops);
  }

  /**
   * Function to handle down button click for reordering stops
   * @param index the index of the stop
   */
  function downButtonClick(index: number) {
    if (index === selectedStops.length-1) return;
    const newStops = [...selectedStops];
    [newStops[index + 1], newStops[index]] = [newStops[index], newStops[index + 1]];
    setSelectedStops(newStops);  
  }

  /**
   * Function to handle route selection from dropdown - sets the current route and selected stops to populate the creator
   * @param selectedOption the route selected from the dropdown
   */
  function onRouteSelected(selectedOption: any) {
    const route = savedRoutes.find(r => r.id === selectedOption.value);
    if (!route) return;
    setSelectedStops(route.stops);
    setCurrentRoute(route);
    setRouteSelected(true);
  }

  /**
   * Function to handle 'Start' button click - passes the stops in the creator to the Directions component
   * @returns 
   */
  async function goButtonClick() {


    let routeLocations: Location[] = [];

    // TODO - replace selectedStops with an array of Location objects
    // Should do this once route builder is functional - IDs are easier for placeholder data conciseness

    console.log("Using created route: ", selectedStops);
    // If using created route, use selectedStops
    if (selectedStops.length < 2) {
      alert("Please select at least two stops to create a route.");
      return;
    }
    
    routeLocations = selectedStops.map(stopId => {
      const loc = locations.find(location => location.id === stopId);
      return loc ? loc : null;
    }).filter(loc => loc !== null) as Location[];
    
    console.log("Route locations: ", routeLocations);
    setShowDirections(true);
    setLocationsToShow(routeLocations);
  }

  return (
    <div className={styles.border}>
      <div className={styles.container}>
        <div className={styles.title}>
          Start Planning Your Route:

        </div>
        <div className={styles.content}>

          <div className={styles.mapContainer}>
            <div className={styles.selecterContainer}>
              <Select
                className={styles.routeSelector}
                options={savedRoutes.map(route => ({ value: route.id, label: route.name }))}
                onChange={onRouteSelected}
                placeholder="Select a Route..."
              />
            </div>
            <div className={styles.map}>
              {<APIProvider apiKey={apiKey || ''}>
                <Map
                  {...mapOptions}
                >
                  {selectedStops && selectedStops.length >= 2 && showDirections && (
                    <Directions 
                      locations={locationsToShow}
                    />
                  )}
                </Map>
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
                      {locations.find(loc => loc.id === stopId)?.name || 'Unknown Location'}
                    </div>
                    <div className={styles.stopType}>
                      {locations.find(loc => loc.id === stopId)?.type || 'Unknown'}
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
              <button className={styles.routeButton} onClick={() => goButtonClick()}>Start › </button>
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
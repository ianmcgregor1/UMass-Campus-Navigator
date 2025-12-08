
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

  /*const mockRoutes = [
    { id: 1, name: 'Route 1', stops: [0, 1, 2] },
    { id: 2, name: 'Route 2', stops: [2, 3, 4] },
  ] as Route[];

  const mockLocations = [
    { id: 0, name: 'Location 1', location: { lat: 42.389971817134544, lng: -72.52622911098678 }, type: 'academic' },
    { id: 1, name: 'Location 2', location: { lat: 42.3908, lng: -72.5267 }, type: 'academic' },
    { id: 2, name: 'Location 3', location: { lat: 42.3914, lng: -72.5258 }, type: 'academic' },
    { id: 3, name: 'Location 4', location: { lat: 42.3900, lng: -72.5289 }, type: 'academic' },
    { id: 4, name: 'Location 5', location: { lat: 42.3925, lng: -72.5242 }, type: 'residential' },
  ] as Location[];*/

  const userId = 1; // TODO - replace with actual user ID from login

  const [savedRoutes, setSavedRoutes] = useState<Array<Route>>([]);
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [selectedLocations, setSelectedLocations] = useState<Array<Location>>([]);
  const [departureTime, setDepartureTime] = useState<string>(Date.now().toString());
  const [routeSelected, setRouteSelected] = useState<boolean>(false);
  const [locationsToShow, setLocationsToShow] = useState<Location[]>([]);
  const [showDirections, setShowDirections] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState<google.maps.Duration | undefined>(undefined);
  const [arrivalTime, setArrivalTime] = useState<Date | undefined>(undefined);
  
  const [currentRoute, setCurrentRoute] = useState<Route>({
      id: 0,
      name: '',
      stops: [],
      user_id: userId
    });
  
  const mapOptions = {
    style: {width: '100%', height: '100%'},
    defaultCenter: {lat: 42.389971817134544, lng: -72.52622911098678},
    defaultZoom: 16,
    gestureHandling: 'greedy',
    disableDefaultUI: true
  }

  // Fallback location information if there is an error
  const defaultLocation = {
    id: -1,
    name: 'Unknown Location',
    location: { lat: 42.389971817134544, lng: -72.52622911098678 },
    type: 'unknown'
  } as Location;

  /*const routeOptions = {
    travelMode: 'WALK',
    polylineQuality: 'HIGH_QUALITY',
    computeAlternativeRoutes: false,
    units: 'IMPERIAL'
  };*/

  // Fetch all locations and user routes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all locations
        const locationsRes = await fetch('http://localhost:5000/api/locations');
        if (!locationsRes.ok) throw new Error('Failed to fetch locations');
        const locations = await locationsRes.json();
        setLocations(locations);
        setLoading(false);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred when fetching locations');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);
  
  useEffect(() => {
        const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user's routes
        const routesRes = await fetch(`http://localhost:5000/api/users/${userId}/routes`);
        if (!routesRes.ok) throw new Error('Failed to fetch routes');
        const routes = await routesRes.json();
        setSavedRoutes(routes);
        setLoading(false);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred when fetching routes');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);


  /**
   * Function to handle up button click for reordering stops
   * @param index the index of the stop
   */
  function upButtonClick(index: number) {
    if (index === 0) return;

    const newLocations = [...selectedLocations];
    [newLocations[index - 1], newLocations[index]] = [newLocations[index], newLocations[index - 1]];
    setSelectedLocations(newLocations);
  }

  /**
   * Function to handle down button click for reordering stops
   * @param index the index of the stop
   */
  function downButtonClick(index: number) {
    if (index === selectedLocations.length-1) return;

    const newLocations = [...selectedLocations];
    [newLocations[index + 1], newLocations[index]] = [newLocations[index], newLocations[index + 1]];
    setSelectedLocations(newLocations);  
  }

  /**
   * Function to handle route selection from dropdown - sets the current route and selected stops to populate the creator
   * @param selectedOption the route selected from the dropdown
   */
  function onRouteSelected(selectedOption: any) {
    const route = savedRoutes.find(r => r.id === selectedOption.value);
    if (!route) return;
    setCurrentRoute(route);

    setSelectedLocations(route.stops.map(stopId => {
      return locations.find(loc => loc.id === stopId) || defaultLocation;
    }));

    setRouteSelected(true);
  }

  /**
   * Function to handle the "Add location" action in the route creator
   */

  /**
   * Function to handle adding a given location to the current route
   * @param locationId ID of the location to be added 
   */
  const handleAddLocation = (locationId: number) => {
    if (currentRoute.stops.includes(locationId)) {
      alert('This location is already in your route!');
      return;
    }
    setCurrentRoute({
      ...currentRoute,
      stops: [...currentRoute.stops, locationId]
    });

    let newLocation = locations.find(loc => loc.id === locationId) || defaultLocation;
    setSelectedLocations([
      ...selectedLocations,
      newLocation
    ]);
    setHasUnsavedChanges(true);
  };

  /**
   * Function to handle removing a location from the current route
   * @param index the index of the location to be removed
   */
  const handleRemoveLocation = (index: number) => {
    setCurrentRoute({
      ...currentRoute,
      stops: currentRoute.stops.filter((_, i) => i !== index)
    });
    setSelectedLocations(selectedLocations.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  /**
   * Function to update the duration and ETA of the currently viewed route
   * @param duration the duration of the route in seconds
   */
  const updateETA = (duration: google.maps.Duration | undefined) => {
    setDuration(duration);
    let timestamp = new Date();
    timestamp.setSeconds(timestamp.getSeconds() + (duration?.value || 0));
    setArrivalTime(timestamp);
    console.log("Updated duration:", duration, "ETA:", timestamp);
  }

  /**
   * Function to handle 'Start' button click - passes the stops in the creator to the Directions component
   * @returns 
   */
  async function displayRoute() {

    let routeLocations: Location[] = [];

    // If using created route, use selectedLocations
    if (selectedLocations.length < 2) {
      alert("Please select at least two stops to display a route.");
      return;
    }
    
    // Filter out default locations (ID of -1)
    routeLocations = selectedLocations.filter(s => 
      s.id !== -1
    ) as Location[];
    
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
                  {selectedLocations && selectedLocations.length >= 2 && showDirections && (
                    <Directions 
                      locations={locationsToShow}
                      onDurationChange={updateETA}
                    />
                  )}
                </Map>
              </APIProvider>}
            </div>
          </div>
          <div className={styles.routeCreator}>
            Create a new route:
            <div className={styles.stopsList}>
              {selectedLocations.map((stop, index) => (
                <div key={index} className={styles.stop}>
                  <div className={styles.stopInfo}>
                    <div className={styles.stopName}>
                      {stop.name}
                    </div>
                    <div className={styles.stopType}>
                      {stop.type}
                    </div>
                  </div>
                  <div className={styles.reorderButtons}>
                    <button className={styles.upButton} disabled={index === 0} onClick={() => upButtonClick(index)}>↑</button>
                    <button className={styles.downButton} disabled={index === selectedLocations.length-1} onClick={() => downButtonClick(index)}>↓</button>
                  </div>
                  <div className={styles.otherButtons}>
                    <button className={styles.removeButton} onClick={() => handleRemoveLocation(index)}>Remove</button>
                  </div>
                </div>
              ))}
              <div className={styles.addStopContainer}>
                {/*<button className={styles.addStopButton}>+ Add Stop</button>*/}
              </div>
            </div>
            <div className={styles.routeButtons}>
              <button className={styles.routeButton} onClick={() => displayRoute()}>Start › </button>
              {/*<button className={styles.saveButton}>Save Route</button>*/}
            </div>
            <div className={styles.routeInfo}>
              <div className={styles.duration}>
                Duration: {duration ? `${duration.text}` : 'N/A'}
              </div>
              <div className={styles.eta}>
                Arrival Time: {arrivalTime ? arrivalTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 'N/A'}
              </div>
            </div>
          </div>

        </div> 
      </div>
    </div>
  );
}
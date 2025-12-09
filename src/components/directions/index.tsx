
import React, { useEffect, useState } from 'react';
import { APIProvider, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { Route } from '../../models/route';
import { Location } from '../../models/location';
import Select from 'react-select';

/**
 * This is the Directions component that provides routing functionality using Google Maps API.
 * It takes in a list of locations and displays the route on its parent Map component.
 * This code is based on the example from vis.gl's react-google-maps library.
 * @param locations List of locations to get directions for
 * @param onDurationChange function to be applied when the route's duration updates
 * @returns Directions component that displays route on map and duration info
 */
export default function Directions({ locations, onDurationChange }: 
{ 
  locations: Location[], 
  onDurationChange: (duration: google.maps.Duration | undefined) => void
}) 
{
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [duration, setDuration] = useState<google.maps.Duration | undefined>();
  const selected = routes[0];
  const leg = selected?.legs[0];

  // useEffect to initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map
      })
    );
  }, [routesLibrary, map]);

  // useEffect to listen for directions changes
  useEffect(() => {
    if (!directionsRenderer) return;

    const listener = directionsRenderer.addListener(
      'directions_changed',
      () => {
        const result = directionsRenderer.getDirections();
        if (result) {
          setRoutes(result.routes);
        }
      }
    );

    return () => google.maps.event.removeListener(listener);
  }, [directionsRenderer]);

  // Use directions service
  useEffect(() => {
    console.log("UE2", locations);
    if (!directionsService || !directionsRenderer) return;

    // Convert location list to proper lat/lng objects
    let origin = locations[0].location;
    let destination = locations[locations.length - 1].location;
    let waypoints = locations.slice(1, locations.length - 1).map(loc => ({
      location: loc.location,
      stopover: true
    }));

    console.log("Requesting route with origin:", origin, "destination:", destination, "waypoints:", waypoints);

    directionsService
      .route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.WALKING,
        provideRouteAlternatives: false,
        unitSystem: google.maps.UnitSystem.IMPERIAL
      })
      .then(response => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });

    return () => directionsRenderer.setMap(map);
  }, [directionsService, directionsRenderer, locations, map]);

  // useEffect to log routes when they are updated
  useEffect(() => {
    console.log("Routes updated:", routes);
    setDuration(routes[0]?.legs[0]?.duration);
  }, [routes]);

  // Update duration whenever it is changed
  useEffect(() => {
    onDurationChange(duration);
  }, [duration]);

  if (!leg) return null;

  return (
    <div className="directions">
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { APIProvider, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { Route } from '../../models/route';
import { Location } from '../../models/location';
import Select from 'react-select';


export default function Directions({ locations }: { locations: Location[]}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const selected = routes[0];
  const leg = selected?.legs[0];

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map
      })
    );
  }, [routesLibrary, map]);

  // Add the following useEffect to make markers draggable
  useEffect(() => {
    if (!directionsRenderer) return;

    // Add the listener to update routes when directions change
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

  useEffect(() => {
    console.log("Routes updated:", routes);
  }, [routes]);

  if (!leg) return null;

  return (
    <div className="directions">
      <p>Duration: {leg.duration?.text}</p>
    </div>
  );
}
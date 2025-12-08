/**
 * Schedule-Builder implemented solely by Nicholas Ankiewicz
 * 
 * Credits / References
 * - React Router “Contacts” Tutorial (CRUD, routing, forms, delete flows): https://reactrouter.com/en/main/start/tutorial
 * - React Select docs (select input patterns, grouped/async options): https://react-select.com/home
 * - MDN Express (Node.js/Express backend patterns & CRUD routing): https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs
 * - react-beautiful-dnd (archived, still a clear API reference): https://github.com/atlassian/react-beautiful-dnd
 * - Dnd Kit (modern alternative for sortable lists): https://dndkit.com/
 * - Thinking in React (component breakdown, grouped lists, state lifting): https://react.dev/learn/thinking-in-react
 */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useBeforeUnload } from 'react-router-dom';
import styles from './schedule-builder.module.scss';

interface Location {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  type: string;
}

interface Route {
  id: number;
  name: string;
  stops: number[];
  user_id: number;
}

/**
 * This is the ScheduleBuilderPage component that allows users to create, edit, and manage their routes.
 * It serves as the main interface for customizing routes
 * @returns ScheduleBuilderPage
 */
function ScheduleBuilderPage() {
  // Hardcoded userId for testing (until login is implemented)
  const userId = 1;

  // State management
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [userRoutes, setUserRoutes] = useState<Route[]>([]);
  const [currentRoute, setCurrentRoute] = useState<Route>({
    id: 0,
    name: '',
    stops: [],
    user_id: userId
  });
  const [isNewRoute, setIsNewRoute] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalRoute, setOriginalRoute] = useState<Route | null>(null);

  // Fetch all locations and user routes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all locations
        const locationsRes = await fetch('http://localhost:5000/api/locations');
        if (!locationsRes.ok) throw new Error('Failed to fetch locations');
        const locations = await locationsRes.json();
        setAllLocations(locations);

        // Fetch user's routes
        const routesRes = await fetch(`http://localhost:5000/api/users/${userId}/routes`);
        if (!routesRes.ok) throw new Error('Failed to fetch routes');
        const routes = await routesRes.json();
        setUserRoutes(routes);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Warn user before leaving page with unsaved changes (browser reload/close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Custom navigation blocking for React Router
  useEffect(() => {
    // Store original navigation methods
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    // Override pushState
    window.history.pushState = function(...args) {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(
          'You have unsaved changes. Do you want to discard them and leave this page?'
        );
        if (!confirmLeave) {
          return;
        }
      }
      return originalPushState.apply(window.history, args);
    };

    // Override replaceState
    window.history.replaceState = function(...args) {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(
          'You have unsaved changes. Do you want to discard them and leave this page?'
        );
        if (!confirmLeave) {
          return;
        }
      }
      return originalReplaceState.apply(window.history, args);
    };

    // Restore original methods on cleanup
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [hasUnsavedChanges]);

  // Handle selecting an existing route to edit
  const handleSelectRoute = async (routeId: number) => {
    if (routeId === 0) {
      handleNewRoute();
      return;
    }

    // Check for unsaved changes
    if (hasUnsavedChanges) {
      const userChoice = window.confirm(
        'You have unsaved changes. Do you want to discard them and switch routes?'
      );
      if (!userChoice) return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/routes/${routeId}`);
      if (!res.ok) throw new Error('Failed to fetch route');
      const route = await res.json();
      setCurrentRoute(route);
      setOriginalRoute(JSON.parse(JSON.stringify(route))); // Deep copy
      setIsNewRoute(false);
      setHasUnsavedChanges(false);
      setSaveMessage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load route');
    }
  };

  // Handle creating a new route
  const handleNewRoute = () => {
    // Check for unsaved changes
    if (hasUnsavedChanges) {
      const userChoice = window.confirm(
        'You have unsaved changes. Do you want to discard them and create a new route?'
      );
      if (!userChoice) return;
    }

    const routeName = prompt('Enter route name:');
    if (!routeName) return;

    const newRoute = {
      id: 0,
      name: routeName,
      stops: [],
      user_id: userId
    };
    setCurrentRoute(newRoute);
    setOriginalRoute(JSON.parse(JSON.stringify(newRoute))); // Deep copy
    setIsNewRoute(true);
    setHasUnsavedChanges(false);
    setSaveMessage(null);
  };

  // Handle updating route name
  const handleNameChange = (newName: string) => {
    setCurrentRoute({
      ...currentRoute,
      name: newName
    });
    setHasUnsavedChanges(true);
  };

  // Add a location to the current route
  const handleAddLocation = (locationId: number) => {
    if (currentRoute.stops.includes(locationId)) {
      alert('This location is already in your route!');
      return;
    }
    setCurrentRoute({
      ...currentRoute,
      stops: [...currentRoute.stops, locationId]
    });
    setHasUnsavedChanges(true);
  };

  // Remove a location from the current route
  const handleRemoveLocation = (index: number) => {
    setCurrentRoute({
      ...currentRoute,
      stops: currentRoute.stops.filter((_, i) => i !== index)
    });
    setHasUnsavedChanges(true);
  };

  // Move a stop up in the order
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newStops = [...currentRoute.stops];
    [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    setCurrentRoute({ ...currentRoute, stops: newStops });
    setHasUnsavedChanges(true);
  };

  // Move a stop down in the order
  const handleMoveDown = (index: number) => {
    if (index === currentRoute.stops.length - 1) return;
    const newStops = [...currentRoute.stops];
    [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
    setCurrentRoute({ ...currentRoute, stops: newStops });
    setHasUnsavedChanges(true);
  };

  // Save the current route (create or update)
  const handleSaveRoute = async () => {
    if (!currentRoute.name.trim()) {
      alert('Please enter a route name');
      return;
    }

    if (currentRoute.stops.length === 0) {
      alert('Please add at least one location to your route');
      return;
    }

    try {
      const url = isNewRoute
        ? `http://localhost:5000/api/users/${userId}/routes`
        : `http://localhost:5000/api/users/${userId}/routes/${currentRoute.id}`;
      
      const method = isNewRoute ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentRoute.name,
          stops: currentRoute.stops
        })
      });

      if (!res.ok) throw new Error('Failed to save route');

      const savedRoute = await res.json();
      
      // Update local state
      if (isNewRoute) {
        const newRoute = { ...currentRoute, id: savedRoute.id };
        setUserRoutes([...userRoutes, newRoute]);
        setCurrentRoute(newRoute);
        setOriginalRoute(JSON.parse(JSON.stringify(newRoute))); // Deep copy
        setIsNewRoute(false);
      } else {
        setUserRoutes(userRoutes.map(r => r.id === currentRoute.id ? currentRoute : r));
        setOriginalRoute(JSON.parse(JSON.stringify(currentRoute))); // Deep copy
      }

      setHasUnsavedChanges(false);
      setSaveMessage('Route saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save route');
    }
  };

  // Reset the current route
  const handleReset = () => {
    const message = hasUnsavedChanges 
      ? 'Are you sure you want to reset? Unsaved changes will be lost.'
      : 'Are you sure you want to reset?';
    
    if (window.confirm(message)) {
      setCurrentRoute({
        id: 0,
        name: '',
        stops: [],
        user_id: userId
      });
      setOriginalRoute(null);
      setIsNewRoute(true);
      setHasUnsavedChanges(false);
      setSaveMessage(null);
    }
  };

  // Delete the current route
  const handleDeleteRoute = async () => {
    if (isNewRoute || currentRoute.id === 0) {
      alert('Cannot delete an unsaved route');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${currentRoute.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/routes/${currentRoute.id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete route');

      // Remove from local state
      setUserRoutes(userRoutes.filter(r => r.id !== currentRoute.id));
      
      // Reset to empty state
      setCurrentRoute({
        id: 0,
        name: '',
        stops: [],
        user_id: userId
      });
      setOriginalRoute(null);
      setIsNewRoute(true);
      setHasUnsavedChanges(false);
      setSaveMessage('Route deleted successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete route');
    }
  };

  // Get location details by ID
  const getLocationById = (locationId: number): Location | undefined => {
    return allLocations.find(loc => loc.id === locationId);
  };

  // Group locations by type
  const getGroupedLocations = () => {
    const grouped: { [key: string]: Location[] } = {};
    allLocations.forEach(location => {
      const type = location.type || 'other';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(location);
    });
    return grouped;
  };

  // Toggle group expand/collapse
  const toggleGroup = (type: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  if (loading) {
    return <div className={styles.page}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.page}>Error: {error}</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Schedule Builder</h1>
        <div className={styles.controls}>
          <button onClick={handleNewRoute} className={styles.btnPrimary}>
            New Route
          </button>
          <select 
            onChange={(e) => handleSelectRoute(parseInt(e.target.value))}
            value={currentRoute.id}
            className={styles.routeSelector}
          >
            <option value={0}>-- Select a route to edit --</option>
            {userRoutes.map(route => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {saveMessage && (
        <div className={styles.successMessage}>{saveMessage}</div>
      )}

      <div className={styles.container}>
        {/* Available Locations */}
        <div className={styles.section}>
          <h2>Available Locations</h2>
          <div className={styles.locationsList}>
            {Object.entries(getGroupedLocations()).map(([type, locations]) => (
              <div key={type} className={styles.locationGroup}>
                <div 
                  className={styles.groupHeader}
                  onClick={() => toggleGroup(type)}
                >
                  <span className={styles.groupChevron}>
                    {expandedGroups.has(type) ? '▼' : '►'}
                  </span>
                  <span className={styles.groupTitle}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <span className={styles.groupCount}>({locations.length})</span>
                </div>
                {expandedGroups.has(type) && (
                  <div className={styles.groupContent}>
                    {locations.map(location => (
                      <div 
                        key={location.id} 
                        className={`${styles.locationCard} ${
                          currentRoute.stops.includes(location.id) ? styles.locationCardUsed : ''
                        }`}
                        onClick={() => handleAddLocation(location.id)}
                      >
                        <div className={styles.locationName}>{location.name}</div>
                        <div className={styles.locationType}>{location.type}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Route Builder */}
        <div className={styles.section}>
          <h2>Current Route</h2>
          <input
            type="text"
            value={currentRoute.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter route name..."
            className={styles.routeNameInput}
          />
          <div className={styles.routeBuilder}>
            {currentRoute.stops.length === 0 ? (
              <div className={styles.emptyState}>
                Click on locations to add them to your route
              </div>
            ) : (
              currentRoute.stops.map((stopId, index) => {
                const location = getLocationById(stopId);
                if (!location) return null;
                
                return (
                  <div key={index} className={styles.stopCard}>
                    <div className={styles.stopNumber}>{index + 1}</div>
                    <div className={styles.stopInfo}>
                      <div className={styles.stopName}>{location.name}</div>
                      <div className={styles.stopType}>{location.type}</div>
                    </div>
                    <div className={styles.stopControls}>
                      <button 
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className={styles.btnIcon}
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => handleMoveDown(index)}
                        disabled={index === currentRoute.stops.length - 1}
                        className={styles.btnIcon}
                        title="Move down"
                      >
                        ▼
                      </button>
                      <button 
                        onClick={() => handleRemoveLocation(index)}
                        className={styles.btnIcon}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.section}>
          <h2>Actions</h2>
          <div className={styles.actions}>
            <button 
              onClick={handleSaveRoute}
              className={styles.btnSuccess}
              disabled={currentRoute.stops.length === 0}
            >
              Save Route
            </button>
            <button 
              onClick={handleReset}
              className={styles.btnSecondary}
            >
              Reset
            </button>
            <button 
              onClick={handleDeleteRoute}
              className={styles.btnDanger}
              disabled={isNewRoute || currentRoute.id === 0}
            >
              Delete Route
            </button>
            <div className={styles.routeInfo}>
              <p><strong>Route Name:</strong> {currentRoute.name || 'None'}</p>
              <p><strong>Total Stops:</strong> {currentRoute.stops.length}</p>
              <p>
                <strong>Status:</strong> 
                {hasUnsavedChanges ? (
                  <span className={styles.statusUnsaved}> ⚠️ Unsaved changes</span>
                ) : isNewRoute ? (
                  <span className={styles.statusNew}> New Route</span>
                ) : (
                  <span className={styles.statusSaved}> ✓ Saved</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleBuilderPage;

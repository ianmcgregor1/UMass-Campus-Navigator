import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import HomePage from '../../src/pages/homepage';

// Mock Google Maps
jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: any) => <div data-testid="api-provider">{children}</div>,
  Map: () => <div data-testid="google-map">Map</div>,
  useMapsLibrary: () => null
}));

// Mock Directions component
jest.mock('../../src/components/directions', () => {
  return function MockDirections() {
    return <div data-testid="directions">Directions Component</div>;
  };
});

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const MockHomePage = ({ isLoggedIn = true }: { isLoggedIn?: boolean }) => {
  if (isLoggedIn) {
    localStorage.setItem('user', JSON.stringify({ 
      id: 1, name: 'Test User', email: 'test@test.com' 
    }));
  } else {
    localStorage.clear();
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockNavigate.mockClear();
    process.env.REACT_APP_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('redirects to account page if not logged in', async () => {
    render(<MockHomePage isLoggedIn={false} />);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/account');
    });
  });

  it('fetches locations on mount when logged in', async () => {
    const mockLocations = [
      { id: 1, name: 'Campus Center', location: { lat: 42.39, lng: -72.52 }, type: 'building' },
      { id: 2, name: 'Library', location: { lat: 42.39, lng: -72.53 }, type: 'building' }
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockLocations
    });

    render(<MockHomePage />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/locations');
    });
  });

  it('fetches user routes on mount', async () => {
    const mockRoutes = [
      { id: 1, name: 'My Route', stops: [], user_id: 1 }
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRoutes
      });

    render(<MockHomePage />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/1/routes');
    });
  });

  it('renders Google Map component', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    });

    render(<MockHomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('google-map')).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import AccountPage from '../../src/pages/account';

const MockAccountPage = () => (
  <BrowserRouter>
    <AuthProvider>
      <AccountPage />
    </AuthProvider>
  </BrowserRouter>
);

describe('AccountPage', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders login form when not logged in', () => {
    render(<MockAccountPage />);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('switches to registration form when register is clicked', () => {
    render(<MockAccountPage />);
    
    const registerButton = screen.getByRole('button', { name: /register here/i });
    fireEvent.click(registerButton);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@test.com' };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser })
    });

    render(<MockAccountPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@test.com' } 
    });
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'password123' } 
    });
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/users/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@test.com',
            password: 'password123'
          })
        })
      );
    });
  });

  it('displays error message on failed login', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' })
    });

    render(<MockAccountPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'wrong@test.com' } 
    });
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'wrongpassword' } 
    });
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});

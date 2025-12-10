import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import React from 'react';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts with no user logged in', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('logs in a user and persists to localStorage', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    
    const testUser = { id: 1, name: 'Test User', email: 'test@test.com' };
    
    act(() => {
      result.current.login(testUser);
    });
    
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual(testUser);
    expect(localStorage.getItem('user')).toBeTruthy();
    
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    expect(savedUser).toEqual(testUser);
  });

  it('logs out a user and clears localStorage', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    
    act(() => {
      result.current.login({ id: 1, name: 'Test User', email: 'test@test.com' });
    });
    
    expect(result.current.isLoggedIn).toBe(true);
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('restores user from localStorage on mount', () => {
    const testUser = { id: 1, name: 'Test User', email: 'test@test.com' };
    localStorage.setItem('user', JSON.stringify(testUser));
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual(testUser);
  });
});

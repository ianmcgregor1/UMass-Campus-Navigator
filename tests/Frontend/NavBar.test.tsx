import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import NavBar from '../../src/components/nav-bar';

describe('NavBar Component', () => {
  it('renders all navigation links', () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Schedule Builder')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('renders the application title', () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('UMass Campus Navigator')).toBeInTheDocument();
  });
});

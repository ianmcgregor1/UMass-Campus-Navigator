// src/App.js
import React from 'react';
import NavBar from './components/nav-bar';
import Main from './pages';
import { AuthProvider } from './context/AuthContext';
import styles from '../src/pages/globals.scss';
//import AboutPage from './pages/AboutPage';
//import ContactPage from './pages/ContactPage';

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <NavBar />
        <Main /> 
      </div>
    </AuthProvider>
  );
}

export default App;
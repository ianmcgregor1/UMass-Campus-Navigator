// src/App.js
import React from 'react';
import NavBar from './components/nav-bar';
import Main from './pages';
//import AboutPage from './pages/AboutPage';
//import ContactPage from './pages/ContactPage';

function App() {
  return (
    <div className='App'>
      <NavBar />
      <Main /> 
    </div>
  );
}

export default App;
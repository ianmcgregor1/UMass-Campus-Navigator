import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages';
import AccountPage from '../../pages/account';

const Main = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/account" element={<AccountPage />} />
      {/* Add a route for a 404 Not Found page */}
      <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
    </Routes>
  );
}

export default Main;
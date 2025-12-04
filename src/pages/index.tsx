import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './homepage';
import AccountPage from './account';
import ScheduleBuilderPage from './schedule-builder';

const Main = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/schedule-builder" element={<ScheduleBuilderPage />} />
      {/* Add a route for any new pages here */}
      
      <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
    </Routes>
  );
}

export default Main;
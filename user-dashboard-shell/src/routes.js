import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

const UserList = React.lazy (() => import ('userList/App'));
const UserDetails = React.lazy (() => import ('userDetails/App'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserList />} />
      <Route path="/user/:id" element={<UserDetails />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

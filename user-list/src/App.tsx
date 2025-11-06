import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserListPage from './pages/UserListPage';
import { UserProvider } from 'container/shared';
import 'antd/dist/reset.css';
import './styles/index.scss';

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route index element={<UserListPage />} />
      </Routes>
    </UserProvider>
  );
};

export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import UserDetailsPage from "./pages/UserDetailsPage";
import { UserProvider } from 'container/shared';
import 'antd/dist/reset.css';
import './styles/index.scss';

const App = () => {
  return (
    <div>
      <UserProvider>
        <Routes>
          <Route index element={<UserDetailsPage />} />
          <Route path="/user/:id" element={<UserDetailsPage />} />
        </Routes>
      </UserProvider>
    </div>
  );
};

export default App;

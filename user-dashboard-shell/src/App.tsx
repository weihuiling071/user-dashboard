import React, { Suspense, lazy } from 'react';
import Navbar from './components/Navbar.jsx';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { UserProvider } from 'shared/communication/UserContext';
import 'antd/dist/reset.css';
import './styles/index.scss';
import { Spin } from 'antd';

const AppRoutes = lazy(() => import('./routes.js'));

const App = () => {
  return (
    <div>
      <Router>
        <UserProvider>
          <Navbar />
          <Suspense
            fallback={
              <div className="text-center mt-20">
                <Spin size="large" />
              </div>
            }
          >
            <AppRoutes />
          </Suspense>
        </UserProvider>
      </Router>
    </div>
  );
};

export default App;

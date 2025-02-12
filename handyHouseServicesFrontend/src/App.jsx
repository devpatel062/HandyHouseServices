import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { Navbar } from './assets/pages/navBar';
import { HomePage } from './assets/pages/homePage';
import { RepairServices } from './assets/pages/RepairServices';
import { AboutUs } from './assets/pages/AboutUs';
import { CleaningServices } from './assets/pages/CleaningServices';
import { SimpleCard } from './assets/Auth/signin';
import { SignupCard } from './assets/Auth/signup';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    axios
      .get("https://handy-house-services-backend.vercel.app/api/user", { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <>
      {user && !isAuthPage && <Navbar className="fixed top-0 left-0 w-full z-10" />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/homePage" /> : <Navigate to="/signin" />} />
        <Route path="/homePage" element={user ? <HomePage /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={<SimpleCard />} />
        <Route path="/signup" element={<SignupCard />} />
        <Route path="/RepairServices" element={user ? <RepairServices /> : <Navigate to="/signin" />} />
        <Route path="/aboutUs" element={user ? <AboutUs /> : <Navigate to="/signin" />} />
        <Route path="/CleaningServices" element={user ? <CleaningServices /> : <Navigate to="/signin" />} />
      </Routes>
    </>
  );
}

export default App;

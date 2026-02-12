import { useState, useEffect, /* useReducer, */ createContext } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import { Container } from 'postcss'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Navbar } from './assets/pages/navBar'
import { HomePage } from './assets/pages/homePage'
import { RepairServices } from './assets/pages/RepairServices'
import { AboutUs } from './assets/pages/AboutUs'
// import { CleaningServices } from './assets/pages/CleaningServices'
import { SimpleCard } from './assets/Auth/signin'
import { SignupCard } from './assets/Auth/signup'
import { Navigate } from 'react-router-dom'
import  UserProfile  from './assets/pages/userProfile'
import  Faq  from './assets/pages/faq'
import UserBookings from './assets/pages/userBookings'
// import { initialState, reducer } from './assets/reducer/useReducer'
import axios from 'axios'
 
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  // const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/user`, { withCredentials: true })
      .then((response) => setUser(response.data.email))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <UserContext.Provider value = {{ user, setUser}}>
        <div className="pt-1">
          <Navbar className="fixed top-0 z-50 w-full px-6 py-1 bg-transparent" />
          <Routes>
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/signin" />} />
            <Route path="/signin" element={<SimpleCard />} />
            <Route path="/signup" element={<SignupCard />} />
            <Route path="/RepairServices" element={user ? <RepairServices /> : <Navigate to="/signin" />} />
            <Route path="/aboutUs" element={user ? <AboutUs /> : <Navigate to="/signin" />} />
            {/* <Route path="/CleaningServices" element={user ? <CleaningServices /> : <Navigate to="/signin" />} /> */}
            <Route path="/Faq" element={<Faq />} />
            <Route path="/userProfile" element={user ? <UserProfile /> : <Navigate to="/signin" />} />
            <Route path="/myBookings" element={user ? <UserBookings /> : <Navigate to="/signin" />} />
            {/* Add more routes as needed */}
          </Routes>

        </div>
      </UserContext.Provider>
    </>
  )
}

export default App

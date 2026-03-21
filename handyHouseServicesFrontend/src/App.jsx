import { useState, useEffect, /* useReducer, */ createContext } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import { Container } from 'postcss'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/navBar'
import { HomePage } from './pages/homePage'
import { RepairServices } from './pages/RepairServices'
import { AboutUs } from './pages/AboutUs'
// import { CleaningServices } from './assets/pages/CleaningServices'
import { SimpleCard } from './Auth/signin'
import { SignupCard } from './Auth/signup'
import { Navigate } from 'react-router-dom'
import  UserProfile  from './pages/userProfile'
import  Faq  from './pages/faq'
import UserBookings from './pages/userBookings'
// import { initialState, reducer } from './assets/reducer/useReducer'
import axios from 'axios'
 
export const UserContext = createContext();

function ProtectedRoute({ user, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  // const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/user`, { withCredentials: true })
      .then((response) => setUser(response.data))
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
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SimpleCard />} />
            <Route path="/signup" element={<SignupCard />} />
            <Route path="/RepairServices" element={<RepairServices />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            {/* <Route path="/CleaningServices" element={user ? <CleaningServices /> : <Navigate to="/signin" />} /> */}
            <Route path="/Faq" element={<Faq />} />
            <Route
              path="/userProfile"
              element={(
                <ProtectedRoute user={user}>
                  <UserProfile />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/myBookings"
              element={(
                <ProtectedRoute user={user}>
                  <UserBookings />
                </ProtectedRoute>
              )}
            />
            {/* Add more routes as needed */}
          </Routes>

        </div>
      </UserContext.Provider>
    </>
  )
}

export default App

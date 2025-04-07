import { useState, useEffect, useReducer, createContext } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import { Container } from 'postcss'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Navbar } from './assets/pages/navBar'
import { HomePage } from './assets/pages/homePage'
import { RepairServices } from './assets/pages/RepairServices'
import { AboutUs } from './assets/pages/AboutUs'
import { CleaningServices } from './assets/pages/CleaningServices'
import { SimpleCard } from './assets/Auth/signin'
import { SignupCard } from './assets/Auth/signup'
import { Navigate } from 'react-router-dom';
// import { initialState, reducer } from './assets/reducer/useReducer'
import axios from 'axios'
 
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null)
  // const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    axios
      .get("https://handy-house-services-backend.vercel.app/api/user", { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch(() => setUser(null))
  }, [])
  return (
    <>
      <UserContext.Provider value = {{ user, setUser}}>
        <Navbar className="w-full bg-white shadow-md z-100" />
        <div className="pt-16"> {/* Adjust the padding-top value according to the navbar height */}
          <Routes>
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/signin" />} />
            <Route path="/signin" element={<SimpleCard />} />
            <Route path="/signup" element={<SignupCard />} />
            <Route path="/RepairServices" element={user ? <RepairServices /> : <Navigate to="/signin" />} />
            <Route path="/aboutUs" element={user ? <AboutUs /> : <Navigate to="/signin" />} />
            <Route path="/CleaningServices" element={user ? <CleaningServices /> : <Navigate to="/signin" />} />
          </Routes>

        </div>
      </UserContext.Provider>
    </>
  )
}

export default App

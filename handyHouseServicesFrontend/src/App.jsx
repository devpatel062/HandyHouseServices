// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import { Container } from 'postcss'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Navbar } from './assets/pages/navBar'
import { HomePage } from './assets/pages/homePage'
import { RepairServices } from './assets/pages/RepairServices'
import { AboutUs } from './assets/pages/AboutUs'
import {CleaningServices} from './assets/pages/CleaningServices'
import {SimpleCard} from './assets/Auth/signin'
import {SignupCard} from './assets/Auth/signup'
import { Navigate } from 'react-router-dom';
function App() {

  return (
    <>
      <Navbar className="fixed top-0 left-0 w-full z-10"/>
      <div className="pt-16"> {/* Adjust the padding-top value according to the navbar height */}
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/signin" element={<SimpleCard />} />
          <Route path="/signup" element={<SignupCard />} />
          <Route path="/RepairServices" element={<RepairServices />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="CleaningServices" element={<CleaningServices />} />
        </Routes>
      </div>
    </>
  )
}

export default App

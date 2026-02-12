import {React, useEffect, useContext} from 'react'
import { UserContext } from '../../App'; 

export const handleLogout = async () => {

    const {state, dispatch} = useContext(UserContext)
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {}, { withCredentials: true });
      setUser(null);
      dispatch({type:UserContext, payload:false})
      navigate('/signin');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
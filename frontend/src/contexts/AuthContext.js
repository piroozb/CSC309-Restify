import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const access_token = Cookies.get('Access');

  async function login(email, password) {
    const data = await AuthService.login(email, password);
    return data;
  }

  async function sign_up(first_name, last_name, email, password, password2) {
    const data = await AuthService.sign_up(first_name, last_name,email, password, password2);
    return data;
  }

  function logout() {
    AuthService.logout();
    setUser(null);
    navigate("/login");
    window.location.reload();
  }


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currUser = await AuthService.getCurrentUser();
        setUser(currUser);
      } catch (error) {
        console.error(error);
      }
    };
    if (access_token){
      
      fetchUser();
    }
  }, []);


   // axios instance for making requests
   const authAxios = axios.create();



   authAxios.interceptors.response.use(
     (response) => {
       if (response.data) {
         if (response.status === 200 || response.status === 201) {
           return response;
         }
         return Promise.reject(response);
       }
       return response;
     },
     (error) => {
       if (error.response.status === 401) {
         logout();
       }
       return Promise.reject(error);
     }
   );
 

  return (
    <AuthContext.Provider value={{ user, login, logout, authAxios, sign_up }}>
      {children}
    </AuthContext.Provider>
  );
};

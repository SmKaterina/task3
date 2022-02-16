import React from 'react';
import { useState } from "react";
import Axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { useAuth } from "./auth";
function Autorization() {
    const [login, setLogIn] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);
    const { setAuthTokens } = useAuth();

    const logIn = () => {
        Axios.post('/haveUser',{
            login:  login,
            password: password
        }).then((response) => {
          localStorage.setItem('entries', JSON.stringify(response.data));
          if (response.data){
            setAuthTokens(true);
            setLoggedIn(true);
          } else {
            setLoggedIn(false);
            alert('Not found or User is Block');
          }
        })
      };

      if (isLoggedIn) {
        return <Redirect to="/users" />;
      }

    return(
        <div className = 'autorization'>
            <h1>Autorization</h1>
            Login :<input type='text' className ='login' onChange ={(e) => {setLogIn(e.target.value)}}></input>
            Password: <input type="password" className ='password' onChange ={(e) => {setPassword(e.target.value)}}></input>
            <Link to="/registration">Don't have an account?</Link>
            <button className ='btn btn-outline-primary' onClick ={logIn}> LogIn </button>
        </div>
    );
}

export default Autorization;
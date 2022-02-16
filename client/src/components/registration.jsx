import React, { useState } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
function Registration() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const makeNowDate = () => {
      const today = Date.now();
      const date = new Date(today);
      const dateReg = date.toDateString();
      return dateReg;
    }

    let dateRerist = makeNowDate();
    const addUser = () => {
        Axios.post('/addUser', {
          login: login,
          password: password,
          email: email,
          dateRegist: dateRerist,
          status: 'OK'
        }).then((res) => alert(res.data));
    };

    return(
        <div className = 'registration'>
            <h1>Регистрация</h1>
            Login:<input type='text' placeholder="Введите логин..." className ='login' onChange = {(e)=>{setLogin(e.target.value)} }></input>
            Email:<input type='email' placeholder="Введите email..." className ='email' onChange = {(e)=>{setEmail(e.target.value)}}></input>
            Password:<input type="password" placeholder="Введите пароль..." className ='password' onChange = {(e)=>{setPassword(e.target.value)}}></input>
            <Link to="/">Already have an account?</Link>
            <button className ='btn btn-outline-primary'onClick ={addUser}> Registration </button>
        </div>
    );
}

export default Registration;
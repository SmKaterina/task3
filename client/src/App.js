import './App.css';
import React, { useState } from "react"
import { BrowserRouter, Route } from 'react-router-dom';
import Autorization from './components/autorization';
import Registration from './components/registration';
import Users from './components/users';
import PrivateRoute from './components/privateRoute';
import { AuthContext } from "./components/auth";

function App(props) {
  const [authTokens, setAuthTokens] = useState();
  
  const setTokens = () => {
    const data = localStorage.getItem('entries'); 
    setAuthTokens(JSON.parse(data));
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <BrowserRouter>
					<div>
						<Route exact path="/" component={Autorization} />
            <Route exact path="/registration" component={Registration} />
            <PrivateRoute path="/users" component={Users} />
					</div>
			</BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
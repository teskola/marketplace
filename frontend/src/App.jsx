import { useState, useCallback, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Redirect, 
  Route,
  Switch } 
from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import Authenticate from './users/pages/Authenticate';
import MainNavigation from './shared/components/navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';

import './App.css';
import Products from './products/pages/Products';
import AddProduct from './products/pages/AddProduct';
import Profile from './users/pages/Profile';

const queryClient = new QueryClient();

let logoutTimer;

function App() {
  const [token, setToken] = useState(false);
  const [user, setUser] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(false);

  const login = useCallback((uid, name, email, phone, token, expirationDate) => {
    const user = {
      uid: uid,
      name: name,
      email: email,
      phone: phone,
    }
    setToken(token);
    setUser(user);
    //current date + 1h
    const tokenExpirationDate = 
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
      'userData',
      JSON.stringify({
        user: user, 
        token,
        expiration: tokenExpirationDate.toISOString()
      })
    )
  },[]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  },[]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token &&
        new Date(storedData.expiration) > new Date() //if greater, the expiration is in the future
      ) {
      login(storedData.user.uid, storedData.user.name, storedData.user.email, storedData.user.phone, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Products />
        </Route>
        <Route path="/users" exact>
          <Profile id={user.uid} name={user.name}/>
        </Route>
        <Route path="/products/new" exact>
          <AddProduct />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Products />
        </Route>
        <Route path="/auth">
          <Authenticate />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }
  
  return (
    <AuthContext.Provider
      value={{ 
        isLoggedIn: !!token, 
        token: token, 
        userId: user && user.uid, 
        login: login, 
        logout: logout
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Router>
          <MainNavigation />
          <main>
            {routes}
          </main>
        </Router>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export default App;

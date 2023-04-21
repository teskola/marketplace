import { useState, useCallback, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Authenticate from "./users/pages/Authenticate";
import MainNavigation from "./shared/components/navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";

import "./App.css";
import Products from "./products/pages/Products";
import AddProduct from "./products/pages/AddProduct";
import Profile from "./users/pages/Profile";
import Product from "./products/pages/Product";

let logoutTimer;

function App() {
  const history = useHistory();
  const [token, setToken] = useState(false);
  const [user, setUser] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(false);

  const login = useCallback(
    (user, token, expirationDate) => {      
      setToken(token);
      setUser(user);
      history.push("/");
      //current date + 1h
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          user: user,
          token,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() //if greater, the expiration is in the future
    ) {
      login(
        storedData.user,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: user && user.id,
        login: login,
        logout: logout,
      }}
    >
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact>
            <Products clear/>
          </Route>
          <Route path="/search" exact>
            <Products/>
          </Route>
          <Route path="/users/:handle">
            <Profile />
          </Route>
          <Route path="/products/id/:handle" exact>
            <Product />
          </Route>          
          {!!token && (
              <Route path="/products/new" exact>
                <AddProduct/>
              </Route>
          )}
          {!token && (
            <Route path="/auth">
              <Authenticate />
            </Route>
          )}
        </Switch>
      </main>
    </AuthContext.Provider>
  );
}

export default App;

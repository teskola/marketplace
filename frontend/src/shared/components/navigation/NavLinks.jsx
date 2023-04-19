import { NavLink } from 'react-router-dom';
import { useContext } from 'react';

import { AuthContext } from '../../context/auth-context';

import './NavLinks.css';

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return <ul className="nav-links">
    <li>
        <NavLink to="/" exact>BUY</NavLink>
    </li>   
    {auth.isLoggedIn && (
      <li>
        <NavLink to="/products/new">SELL</NavLink>
      </li>
    )}
     {auth.isLoggedIn && (
      <li>
        <NavLink to={"/users/" + auth.userId}>PROFILE</NavLink>
      </li>
    )}
    {!auth.isLoggedIn && (
      <li>
        <NavLink to="/auth">AUTHENTICATE</NavLink>
      </li>
    )}
    {auth.isLoggedIn && (
      <li>
        <button onClick={auth.logout}>LOGOUT</button>
      </li>
    )}
  </ul>
};

export default NavLinks;

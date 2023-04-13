import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';

import NavLinks from './NavLinks';

describe('The Navigation Links', () => {
  test('Should only show ALL CITIES and AUTHENTICATE when not authorized', () =>{
    render(
        <BrowserRouter>
          <NavLinks/>;
        </BrowserRouter>
    );

    expect(screen.getByRole('list')).toHaveClass('nav-links');
    expect(screen.getByText('ALL CITIES')).toBeInTheDocument();
    expect(screen.getByText('ALL CITIES')).toHaveAttribute('href', '/');
    
    expect(screen.getByText('AUTHENTICATE')).toBeInTheDocument();
    expect(screen.getByText('AUTHENTICATE')).toHaveAttribute('href', '/auth');

    expect(screen.queryByText('ALL USERS')).toBeNull();
  });

  test('Should show correct buttons when authorized', () =>{
    render(
      <AuthContext.Provider value={{
        isLoggedIn: true,
        token: '1234567890-0987654321',
        userId: 'userId1',
        login: () => {},
        logout: () => {}
      }}
      >
        <BrowserRouter>
          <NavLinks/>;
        </BrowserRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole('list')).toHaveClass('nav-links');
    expect(screen.getByText('ALL CITIES')).toBeInTheDocument();
    expect(screen.getByText('ALL CITIES')).toHaveAttribute('href', '/');
    
    expect(screen.queryByText('AUTHENTICATE')).toBeNull();

    expect(screen.getByText('ALL USERS')).toBeInTheDocument();
    expect(screen.getByText('ALL USERS')).toHaveAttribute('href', '/users');

    expect(screen.getByText('ADD CITY')).toBeInTheDocument();
    expect(screen.getByText('ADD CITY')).toHaveAttribute('href', '/cities/new');

    expect(screen.getByRole('button', { name: 'LOGOUT'})).toBeInTheDocument();
  });
});
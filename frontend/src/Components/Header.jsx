import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Make sure to create a CSS file for styling
import { Button } from 'bootstrap';
//import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Header = () => {
    //const { isLoggedIn, logout } = useContext(AuthContext);
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyCookie = async () => {
          if (!cookies.token) {
            setUsername('');
            return;
          }
          try {
            const { data } = await axios.post(
              'http://localhost:3002/verify-cookie',
              {},
              { withCredentials: true }
            );
            const { status, user } = data;
            if (status) {
              setUsername(user);
            } else {
              removeCookie('token');
              setUsername('');
            }
          } catch (error) {
            console.error('Network Error', error);
            removeCookie('token');
            setUsername('');
          }
        };
        verifyCookie();
      }, [cookies, removeCookie]);

      const handleLogout = () => {
        removeCookie('token');
        setUsername('');
        navigate('/login');
      };

      
    return (
        <header className="header fixed-header">
            <div className="header__left">
                <h1>CanTeenz</h1>
            </div>

            <nav className="header__nav">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/orders">Orders</Link>
                <Link to="/contact">Contact</Link>
            </nav>
            
            <div className="header__right">
                {username ? (
                    <div className="user-menu">
                        <i className="fas fa-user user-icon fa-2x"></i>
                        <div className="user-menu__dropdown">
                        <span>Welcome, {username}</span>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="btnNav">Login</Link>
                        <Link to="/signup" className="btnNav">Signup</Link>
                    </>
                )}
            </div>
        </header>
        
    );
};

export default Header;
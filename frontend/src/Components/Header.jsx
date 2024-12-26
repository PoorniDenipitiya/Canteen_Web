import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Make sure to create a CSS file for styling
import { Button } from 'bootstrap';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);

    return (
        <header className="header fixed-header">
            <div className="header__left">
                <h1>CanTeenz</h1>
            </div>

            <nav className="header__nav">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/services">Services</Link>
                <Link to="/contact">Contact</Link>
            </nav>
            
            <div className="header__right">
                {isLoggedIn ? (
                    <div className="user-menu">
                        <i className="fas fa-user user-icon fa-2x"></i>
                        <div className="user-menu__dropdown">
                            <button onClick={logout}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="btnNav">Login</Link>
                        <Link to="/register" className="btnNav">Signup</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/appConfig';
import { useCookies } from 'react-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [cookies, removeCookie] = useCookies([]);

    useEffect(() => {
        const verifyCookie = async () => {
            if (!cookies.token) {
                setIsLoggedIn(false);
                setUser(null);
                return;
            }
            try {
                const { data } = await axios.post(
                    `${config.api_base_urls.user}/verify-cookie`,
                    {},
                    { withCredentials: true }
                );
                const { status, user } = data;
                if (status) {
                    setIsLoggedIn(true);
                    setUser(user);
                } else {
                    removeCookie('token');
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('Network Error', error);
                removeCookie('token');
                setIsLoggedIn(false);
                setUser(null);
            }
        };
        verifyCookie();
    }, [cookies, removeCookie]);

    const login = (user) => {
        setIsLoggedIn(true);
        setUser(user);
    };

    const logout = () => {
        removeCookie('token');
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
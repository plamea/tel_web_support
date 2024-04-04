import React, {createContext, useContext, useState, useEffect} from 'react';
import axios from "axios";

const AuthContext = createContext();

function parseJWT(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export const AuthProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

    const login = (atoken, rtoken) => {
        setAccessToken(atoken);
        setRefreshToken(rtoken);
        localStorage.setItem('accessToken', atoken);
        localStorage.setItem('refreshToken', rtoken);
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const updateTokens = () => {
        const customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            }
        };
        axios.post('/api/refresh', {}, customConfig)

            .then((response) => {
                if (response?.data) {
                    setAccessToken(response.data.access_token);
                    setRefreshToken(response.data.refresh_token);
                    localStorage.setItem('accessToken', response.data.access_token);
                    localStorage.setItem('refreshToken', response.data.refresh_token);
                }
            })
            .catch((error) => {
                if (error.response?.data?.detail === "Signature has expired") {
                    logout()
                }
            });
    }

    useEffect(() => {
        if (accessToken === null || refreshToken === null) return
        const repeater = setInterval(
            () => {
                // console.log(parseJWT(accessToken));
                // console.log(parseJWT(refreshToken));
                if (new Date().getTime() / 1000 > parseJWT(refreshToken).exp) {
                    logout()
                }
                if (parseJWT(refreshToken).exp > new Date().getTime() / 1000 && parseJWT(accessToken).exp - new Date().getTime() / 1000 < 30) {
                    updateTokens()
                }
            }, 1_000);
        console.log(parseJWT(accessToken));
        return () => clearInterval(repeater);
    }, [accessToken, refreshToken, updateTokens, logout]);

    return (
        <AuthContext.Provider value={{accessToken, login, logout, updateTokens}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

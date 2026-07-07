import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'sonner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isloading, setIsLoading] = useState(true);

    // check if user is laready logged in when the app loads
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = awaot axiosInstance.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setCurrentUser(user);

            toast.success("Logged in successfully!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        toast.info("Logged out successfully!");
    };

    return (
        <AuthContext.provider value={{
            currentUser,
            login,
            logout,
            isLoading
        }} >
            {children}
        </AuthContext.provider>
    );
};
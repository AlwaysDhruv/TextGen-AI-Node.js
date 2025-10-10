import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NavigationBar() {
    const [userName, setUserName] = useState('');
    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.href = '/';
    };

    return (
        <nav className="flex justify-between items-center p-6 bg-black/60 backdrop-blur-md z-10 border-b border-gray-800">
            <div>
                <Link to="/developer" className="text-white hover:text-blue-400 font-bold text-xl tracking-wide flex items-center gap-2 transition">
                    <i className="fas fa-code text-blue-500"></i> Developers
                </Link>
            </div>
            <div className="space-x-4 flex items-center">
                <>
                    <Link to="/auth" state={{ isLoginView: false }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">Sign Up</Link>
                    <Link to="/auth" state={{ isLoginView: true }} className="text-white hover:text-blue-400 underline px-3 py-2 transition">Sign In</Link>
                </>
            </div>
        </nav>
    );
}

export default NavigationBar;
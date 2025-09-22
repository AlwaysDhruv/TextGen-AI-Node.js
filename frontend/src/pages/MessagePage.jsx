import React, { useState, useEffect } from 'react';

function MessagePage() {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    return (
        <div className="container mx-auto p-4">
            {userName ? (
                <h1 className="text-3xl font-bold">Hello, {userName}!</h1>
            ) : (
                <h1 className="text-3xl font-bold">Hello!</h1>
            )}
            <p className="mt-4">This is your personalized message page. Welcome to the site!</p>
        </div>
    );
}

export default MessagePage;
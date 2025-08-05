import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);

	const handleLogout = () => {
		setUser(null);
		setToken(null);
	};

	return (
		<UserContext.Provider value={{ user, token, setUser, setToken, logout: handleLogout }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);

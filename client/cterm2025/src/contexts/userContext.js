import React, { createContext, useContext, useEffect } from 'react';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const { user, token } = useContext(UserContext);

	return (
		<UserContext.Provider value={{ token, user, logout: handleLogout }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
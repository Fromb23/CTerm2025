import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback((message, type = 'info') => {
		const id = uuidv4();
		setToasts(prev => [...prev, { id, message, type }]);
		setTimeout(() => {
			setToasts(prev => prev.filter(toast => toast.id !== id));
		}, 4000);
	}, []);

	const value = { addToast };

	return (
		<ToastContext.Provider value={value}>
			{children}
			<div className="fixed top-4 right-4 z-50 space-y-2">
				{toasts.map(({ id, message, type }) => (
					<div
						key={id}
						className={`px-4 py-2 rounded shadow text-white animate-slideInRight transition-all
              ${type === 'success' ? 'bg-green-600' : ''}
              ${type === 'error' ? 'bg-red-600' : ''}
              ${type === 'info' ? 'bg-blue-600' : ''}`}
					>
						{message}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
};

export const useToast = () => useContext(ToastContext);

import React from "react";

const MainContent = ({ children }) => {
	return (
		<main className="flex-1 bg-background text-primary p-6 overflow-y-auto">
			{children}
		</main>
	);
};

export default MainContent;

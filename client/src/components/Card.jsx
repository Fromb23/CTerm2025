import React from "react";
import clsx from "clsx";

const Card = ({
	children,
	className = "",
	padding = "p-6",
	shadow = "shadow-theme",
	border = "border border-primary",
	rounded = "rounded-xl"
}) => {
	return (
		<div className={clsx("bg-card", border, rounded, shadow, padding, className)}>
			{children}
		</div>
	);
};

export default Card;

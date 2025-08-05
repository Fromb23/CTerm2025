import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Button = ({
	children,
	variant = 'primary', // 'primary' | 'secondary' | 'destructive'
	size = 'md',
	className = '',
	...props
}) => {
	const baseClasses = 'rounded-md font-medium transition-colors inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2';

	const sizeClasses = {
		sm: 'text-sm px-3 py-1',
		md: 'text-base px-4 py-2',
		lg: 'text-lg px-6 py-3',
	};

	const variantClasses = {
		primary: 'button-primary hover:bg-button-primary-hover',
		secondary: 'button-secondary hover:bg-button-secondary-hover',
		destructive: 'button-destructive hover:bg-button-destructive-hover',
	};

	return (
		<button
			className={clsx(baseClasses, sizeClasses[size], variantClasses[variant], className)}
			{...props}
		>
			{children}
		</button>
	);
};

Button.propTypes = {
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf(['primary', 'secondary', 'destructive']),
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
	className: PropTypes.string,
};

export default Button;
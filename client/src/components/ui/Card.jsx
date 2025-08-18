import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Card = ({
  children,
  variant = 'default', // 'default' | 'elevated' | 'outlined'
  status,              // optional: success, error, warning, etc.
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-card text-primary rounded-lg transition-shadow';

  const variantClasses = {
    default: 'shadow-theme',
    elevated: 'shadow-theme-lg hover:shadow-theme-xl',
    outlined: 'border border-primary shadow-none',
  };

  const statusClasses = status ? `border-${status} text-${status}` : '';

  return (
    <div
      className={clsx(baseClasses, variantClasses[variant], statusClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
  status: PropTypes.oneOf([
    'success',
    'warning',
    'error',
    'pending',
    'info',
    'default',
  ]),
  className: PropTypes.string,
};

export default Card;
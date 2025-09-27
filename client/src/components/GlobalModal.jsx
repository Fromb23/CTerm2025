import React from 'react';
import { X } from 'lucide-react';

const GlobalModal = ({
	isOpen,
	onClose,
	title,
	children,
	actions,
	size = 'default',
	className = ''
}) => {
	if (!isOpen) return null;

	const getSizeClasses = () => {
		switch (size) {
			case 'small':
				return 'max-w-md';
			case 'large':
				return 'max-w-4xl';
			case 'extra-large':
				return 'max-w-6xl';
			default:
				return 'max-w-2xl';
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className={`bg-white rounded-2xl shadow-xl ${getSizeClasses()} w-full max-h-[90vh] overflow-y-auto ${className}`}>
				<div className="p-8">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-gray-900">{title}</h2>
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<X className="w-5 h-5 text-gray-500" />
						</button>
					</div>

					{/* Content */}
					<div className="mb-6">
						{children}
					</div>

					{/* Actions */}
					{actions && (
						<div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
							{actions}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default GlobalModal;
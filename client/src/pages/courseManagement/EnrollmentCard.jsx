import React, { useState } from 'react';
import {
	MoreVertical, Play, Pause, CheckCircle, Eye, X, Trash2,
	Globe, User, Monitor, BookOpen
} from 'lucide-react';

const EnrollmentCard = ({
	enrollment,
	onUpdateProgress,
	onUpdateStatus,
	onDelete,
	onViewDetails
}) => {
	const [localProgress, setLocalProgress] = useState(enrollment.completion_percentage);
	const [isEditingProgress, setIsEditingProgress] = useState(false);

	const getStatusBgColor = (status) => {
		switch (status) {
			case 'active': return 'bg-green-500';
			case 'pending': return 'bg-yellow-500';
			case 'paused': return 'bg-orange-500';
			case 'completed': return 'bg-blue-500';
			case 'withdrawn': return 'bg-red-500';
			default: return 'bg-gray-500';
		}
	};

	const getModeIcon = (mode) => {
		switch (mode) {
			case 'online': return <Globe className="w-4 h-4" />;
			case 'offline': return <User className="w-4 h-4" />;
			case 'hybrid': return <Monitor className="w-4 h-4" />;
			default: return <BookOpen className="w-4 h-4" />;
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
			<div className="p-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<div className="flex items-center space-x-2 mb-2">
							<h3 className="text-lg font-semibold text-gray-900">
								{enrollment.user.first_name} {enrollment.user.last_name}
							</h3>
							<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(enrollment.status)} text-white capitalize`}>
								{enrollment.status}
							</span>
						</div>
						<p className="text-sm text-gray-600">{enrollment.user.email}</p>
					</div>
					<div className="relative">
						<button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
							<MoreVertical className="w-4 h-4 text-gray-400" />
						</button>
					</div>
				</div>

				<div className="mb-4">
					<h4 className="font-medium text-gray-900 mb-1">{enrollment.course.name}</h4>
					<p className="text-sm text-gray-600">{enrollment.course.course_code}</p>
				</div>

				<div className="mb-4">
					<div className="flex items-center justify-between text-sm mb-2">
						<span className="text-gray-600">Progress:</span>
						{isEditingProgress ? (
							<div className="flex items-center space-x-2">
								<input
									type="number"
									value={localProgress}
									onChange={(e) => setLocalProgress(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
									className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									min="0"
									max="100"
									step="0.1"
								/>
								<button
									onClick={() => {
										onUpdateProgress(enrollment.id, localProgress);
										setIsEditingProgress(false);
									}}
									className="text-green-600 hover:text-green-700"
								>
									<CheckCircle className="w-4 h-4" />
								</button>
								<button
									onClick={() => {
										setLocalProgress(enrollment.completion_percentage);
										setIsEditingProgress(false);
									}}
									className="text-red-600 hover:text-red-700"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						) : (
							<button
								onClick={() => setIsEditingProgress(true)}
								className="text-gray-900 font-medium hover:text-blue-600 cursor-pointer"
							>
								{enrollment.completion_percentage.toFixed(1)}%
							</button>
						)}
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-blue-500 h-2 rounded-full transition-all duration-300"
							style={{ width: `${enrollment.completion_percentage}%` }}
						></div>
					</div>
				</div>

				<div className="space-y-2 mb-4 text-sm">
					<div className="flex items-center justify-between">
						<span className="text-gray-600">Enrolled:</span>
						<span className="text-gray-900">{formatDate(enrollment.enrolled_on)}</span>
					</div>
					{enrollment.completed_on && (
						<div className="flex items-center justify-between">
							<span className="text-gray-600">Completed:</span>
							<span className="text-green-600">{formatDate(enrollment.completed_on)}</span>
						</div>
					)}
					<div className="flex items-center justify-between">
						<span className="text-gray-600">Last Updated:</span>
						<span className="text-gray-900">{formatDate(enrollment.updated_at)}</span>
					</div>
				</div>

				<div className="flex items-center justify-between pt-4 border-t border-gray-200">
					<div className="flex items-center space-x-2">
						{enrollment.status === 'active' && (
							<button
								onClick={() => onUpdateStatus(enrollment.id, 'paused')}
								className="flex items-center px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm"
							>
								<Pause className="w-4 h-4 mr-1" />
								Pause
							</button>
						)}
						{enrollment.status === 'paused' && (
							<button
								onClick={() => onUpdateStatus(enrollment.id, 'active')}
								className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
							>
								<Play className="w-4 h-4 mr-1" />
								Resume
							</button>
						)}
						{(enrollment.status === 'active' || enrollment.status === 'paused') && (
							<button
								onClick={() => onUpdateStatus(enrollment.id, 'completed')}
								className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
							>
								<CheckCircle className="w-4 h-4 mr-1" />
								Complete
							</button>
						)}
					</div>

					<div className="flex items-center space-x-2">
						<button
							onClick={() => onViewDetails(enrollment)}
							className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
						>
							<Eye className="w-4 h-4 mr-1" />
							Details
						</button>
						{enrollment.status !== 'withdrawn' && (
							<button
								onClick={() => onUpdateStatus(enrollment.id, 'withdrawn')}
								className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
							>
								<X className="w-4 h-4 mr-1" />
								Withdraw
							</button>
						)}
						<button
							onClick={() => onDelete(enrollment.id)}
							className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
						>
							<Trash2 className="w-4 h-4 mr-1" />
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EnrollmentCard;
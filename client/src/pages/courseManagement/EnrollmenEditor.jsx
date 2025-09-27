import React from 'react';
import {
	User, BookOpen, Activity, Clock, CheckCircle, Play, Pause, X,
	Globe, Monitor
} from 'lucide-react';
import GlobalModal from '../../components/GlobalModal';

const EnrollmentEditor = ({
	showEnrollmentModal,
	setShowEnrollmentModal,
	showEnrollmentDetailsModal,
	setShowEnrollmentDetailsModal,
	selectedEnrollment,
	enrollmentFormData,
	setEnrollmentFormData,
	users,
	courses,
	loading,
	onCreateEnrollment,
	onUpdateStatus,
	resetEnrollmentForm
}) => {

	const getModeIcon = (mode) => {
		switch (mode) {
			case 'online': return <Globe className="w-5 h-5" />;
			case 'offline': return <User className="w-5 h-5" />;
			case 'hybrid': return <Monitor className="w-5 h-5" />;
			default: return <BookOpen className="w-5 h-5" />;
		}
	};

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

	const formatDateTime = (dateString) => {
		return new Date(dateString).toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	// Create Enrollment Modal Actions
	const createEnrollmentActions = (
		<>
			<button
				type="button"
				onClick={() => {
					setShowEnrollmentModal(false);
					resetEnrollmentForm();
				}}
				className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
			>
				Cancel
			</button>
			<button
				type="button"
				onClick={onCreateEnrollment}
				disabled={loading}
				className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? 'Enrolling...' : 'Enroll Student'}
			</button>
		</>
	);

	// Enrollment Details Modal Actions
	const detailsModalActions = selectedEnrollment && (
		<div className="flex flex-wrap items-center justify-center gap-4">
			{selectedEnrollment.status === 'active' && (
				<>
					<button
						onClick={() => {
							onUpdateStatus(selectedEnrollment.id, 'paused');
							setShowEnrollmentDetailsModal(false);
						}}
						className="flex items-center px-4 py-2 border border-orange-300 text-orange-700 rounded-lg font-medium hover:bg-orange-50 transition-colors"
					>
						<Pause className="w-4 h-4 mr-2" />
						Pause Enrollment
					</button>
					<button
						onClick={() => {
							onUpdateStatus(selectedEnrollment.id, 'completed');
							setShowEnrollmentDetailsModal(false);
						}}
						className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
					>
						<CheckCircle className="w-4 h-4 mr-2" />
						Mark Complete
					</button>
				</>
			)}
			{selectedEnrollment.status === 'paused' && (
				<button
					onClick={() => {
						onUpdateStatus(selectedEnrollment.id, 'active');
						setShowEnrollmentDetailsModal(false);
					}}
					className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
				>
					<Play className="w-4 h-4 mr-2" />
					Resume Enrollment
				</button>
			)}
			{selectedEnrollment.status !== 'withdrawn' && selectedEnrollment.status !== 'completed' && (
				<button
					onClick={() => {
						onUpdateStatus(selectedEnrollment.id, 'withdrawn');
						setShowEnrollmentDetailsModal(false);
					}}
					className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
				>
					<X className="w-4 h-4 mr-2" />
					Withdraw Student
				</button>
			)}
		</div>
	);

	return (
		<>
			{/* Create Enrollment Modal */}
			<GlobalModal
				isOpen={showEnrollmentModal}
				onClose={() => setShowEnrollmentModal(false)}
				title="Enroll Student"
				size="default"
				actions={createEnrollmentActions}
			>
				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Select Student *</label>
						<select
							value={enrollmentFormData.user_id}
							onChange={(e) => setEnrollmentFormData({ ...enrollmentFormData, user_id: e.target.value })}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							required
						>
							<option value="">Choose a student...</option>
							{users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.first_name} {user.last_name} ({user.email})
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Select Course *</label>
						<select
							value={enrollmentFormData.course_id}
							onChange={(e) => setEnrollmentFormData({ ...enrollmentFormData, course_id: e.target.value })}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							required
						>
							<option value="">Choose a course...</option>
							{courses.filter(course => course.is_published).map((course) => (
								<option key={course.id} value={course.id}>
									{course.name} ({course.course_code})
								</option>
							))}
						</select>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Initial Status</label>
							<select
								value={enrollmentFormData.status}
								onChange={(e) => setEnrollmentFormData({ ...enrollmentFormData, status: e.target.value })}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="pending">Pending</option>
								<option value="active">Active</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Initial Progress (%)</label>
							<input
								type="number"
								value={enrollmentFormData.completion_percentage}
								onChange={(e) => setEnrollmentFormData({ ...enrollmentFormData, completion_percentage: e.target.value })}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="0"
								min="0"
								max="100"
								step="0.1"
							/>
						</div>
					</div>
				</div>
			</GlobalModal>

			{/* Enrollment Details Modal */}
			<GlobalModal
				isOpen={showEnrollmentDetailsModal}
				onClose={() => setShowEnrollmentDetailsModal(false)}
				title="Enrollment Details"
				size="large"
				actions={detailsModalActions}
			>
				{selectedEnrollment && (
					<div className="space-y-6">
						{/* Student Information */}
						<div className="bg-gray-50 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<User className="w-5 h-5 mr-2" />
								Student Information
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<p className="text-sm text-gray-600">Name</p>
									<p className="font-medium text-gray-900">
										{selectedEnrollment.user.first_name} {selectedEnrollment.user.last_name}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">Email</p>
									<p className="font-medium text-gray-900">{selectedEnrollment.user.email}</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">Username</p>
									<p className="font-medium text-gray-900">{selectedEnrollment.user.username}</p>
								</div>
							</div>
						</div>

						{/* Course Information */}
						<div className="bg-gray-50 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<BookOpen className="w-5 h-5 mr-2" />
								Course Information
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-gray-600">Course Name</p>
									<p className="font-medium text-gray-900">{selectedEnrollment.course.name}</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">Course Code</p>
									<p className="font-medium text-gray-900">{selectedEnrollment.course.course_code}</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">Duration</p>
									<p className="font-medium text-gray-900">{selectedEnrollment.course.duration} weeks</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">Mode</p>
									<div className="flex items-center">
										{getModeIcon(selectedEnrollment.course.mode_of_learning)}
										<span className="font-medium text-gray-900 ml-1 capitalize">
											{selectedEnrollment.course.mode_of_learning}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Enrollment Status */}
						<div className="bg-gray-50 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<Activity className="w-5 h-5 mr-2" />
								Enrollment Status
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<p className="text-sm text-gray-600">Current Status</p>
										<span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(selectedEnrollment.status)} text-white capitalize`}>
											{selectedEnrollment.status}
										</span>
									</div>
									<div>
										<p className="text-sm text-gray-600">Active</p>
										<p className={`font-medium ${selectedEnrollment.is_active ? 'text-green-600' : 'text-red-600'}`}>
											{selectedEnrollment.is_active ? 'Yes' : 'No'}
										</p>
									</div>
								</div>
								<div className="space-y-4">
									<div>
										<p className="text-sm text-gray-600">Progress</p>
										<div className="flex items-center space-x-3">
											<div className="flex-1 bg-gray-200 rounded-full h-3">
												<div
													className="bg-blue-500 h-3 rounded-full transition-all duration-300"
													style={{ width: `${selectedEnrollment.completion_percentage}%` }}
												></div>
											</div>
											<span className="font-medium text-gray-900 text-sm">
												{selectedEnrollment.completion_percentage.toFixed(1)}%
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Timeline */}
						<div className="bg-gray-50 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<Clock className="w-5 h-5 mr-2" />
								Timeline
							</h3>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Enrolled On</span>
									<span className="font-medium text-gray-900">{formatDateTime(selectedEnrollment.enrolled_on)}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Last Updated</span>
									<span className="font-medium text-gray-900">{formatDateTime(selectedEnrollment.updated_at)}</span>
								</div>
								{selectedEnrollment.completed_on && (
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">Completed On</span>
										<span className="font-medium text-green-600">{formatDateTime(selectedEnrollment.completed_on)}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</GlobalModal>
		</>
	);
};

export default EnrollmentEditor;
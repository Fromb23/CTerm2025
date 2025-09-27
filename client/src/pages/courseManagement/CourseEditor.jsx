import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import GlobalModal from '../../components/GlobalModal';

const CourseEditor = ({
	isOpen,
	onClose,
	course,
	onSave,
	loading
}) => {
	const [courseFormData, setCourseFormData] = useState({
		name: '',
		course_code: '',
		duration: '',
		mode_of_learning: 'online',
		commitment_time: '',
		requirements: '',
		description: '',
		frequently_asked_questions: {},
		start_date: '',
		is_published: false,
	});

	const [faqInput, setFaqInput] = useState({ question: '', answer: '' });

	useEffect(() => {
		if (course) {
			setCourseFormData({
				name: course.name || '',
				course_code: course.course_code || '',
				duration: course.duration?.toString() || '',
				mode_of_learning: course.mode_of_learning || 'online',
				commitment_time: course.commitment_time?.toString() || '',
				requirements: course.requirements || '',
				description: course.description || '',
				frequently_asked_questions: course.frequently_asked_questions || {},
				start_date: course.start_date ? course.start_date.split('T')[0] : '',
				is_published: course.is_published || false
			});
		}
	}, [course]);

	// Course fields configuration
	const courseFields = [
		{ name: "name", label: "Course Name *", type: "text", placeholder: "Enter course name", required: true },
		{ name: "course_code", label: "Course Code", type: "text", placeholder: "e.g., RCT-ADV-001" },
		{ name: "description", label: "Description", type: "textarea", rows: 4, placeholder: "Describe what students will learn..." },
		{ name: "duration", label: "Duration (weeks) *", type: "number", placeholder: "8", min: 1, required: true },
		{ name: "mode_of_learning", label: "Mode of Learning", type: "select", options: ["online", "offline", "hybrid"] },
		{ name: "commitment_time", label: "Commitment (hours/week) *", type: "number", placeholder: "10", min: 1, required: true },
		{ name: "requirements", label: "Requirements", type: "textarea", rows: 3, placeholder: "Prerequisites and requirements for this course..." },
		{ name: "start_date", label: "Start Date", type: "date" },
		{ name: "frequently_asked_questions", label: "Frequently Asked Questions", type: "faq" },
	];

	const handleSave = () => {
		if (!courseFormData.name || !courseFormData.duration || !courseFormData.commitment_time) {
			alert('Please fill in all required fields');
			return;
		}
		onSave(courseFormData);
	};

	const addFaqEntry = () => {
		if (faqInput.question && faqInput.answer) {
			setCourseFormData({
				...courseFormData,
				frequently_asked_questions: {
					...courseFormData.frequently_asked_questions,
					[faqInput.question]: faqInput.answer
				}
			});
			setFaqInput({ question: '', answer: '' });
		}
	};

	const removeFaqEntry = (question) => {
		const updatedFaqs = { ...courseFormData.frequently_asked_questions };
		delete updatedFaqs[question];
		setCourseFormData({
			...courseFormData,
			frequently_asked_questions: updatedFaqs
		});
	};

	const renderFormField = (field) => {
		const value = courseFormData[field.name];

		return (
			<div
				key={field.name}
				className={["name", "course_code", "duration", "mode_of_learning", "commitment_time"].includes(field.name)
					? "grid grid-cols-1 md:grid-cols-2 gap-6"
					: ""}
			>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{field.label}
					</label>

					{/* Textarea */}
					{field.type === "textarea" && (
						<textarea
							rows={field.rows || 3}
							placeholder={field.placeholder}
							required={field.required}
							value={value}
							onChange={(e) =>
								setCourseFormData({ ...courseFormData, [field.name]: e.target.value })
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
						/>
					)}

					{/* Select */}
					{field.type === "select" && (
						<select
							value={value}
							onChange={(e) =>
								setCourseFormData({ ...courseFormData, [field.name]: e.target.value })
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
						>
							{field.options?.map((opt) => (
								<option key={opt} value={opt}>
									{opt.charAt(0).toUpperCase() + opt.slice(1)}
								</option>
							))}
						</select>
					)}

					{/* Input */}
					{["text", "number", "date"].includes(field.type) && (
						<input
							type={field.type}
							placeholder={field.placeholder}
							required={field.required}
							min={field.min}
							value={value}
							onChange={(e) =>
								setCourseFormData({ ...courseFormData, [field.name]: e.target.value })
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
						/>
					)}

					{/* FAQ Section */}
					{field.type === "faq" && (
						<div>
							{/* Render existing FAQs */}
							{Object.keys(courseFormData.frequently_asked_questions || {}).length === 0 ? (
								<p className="text-gray-500 text-sm">No FAQs added yet.</p>
							) : (
								<div className="space-y-2 mb-4">
									{Object.entries(courseFormData.frequently_asked_questions).map(([question, answer]) => (
										<div key={question} className="bg-gray-50 rounded-lg p-3 flex justify-between items-start">
											<div className="flex-1">
												<p className="font-medium text-gray-900 text-sm">{question}</p>
												<p className="text-gray-600 text-sm mt-1">{answer}</p>
											</div>
											<button
												type="button"
												onClick={() => removeFaqEntry(question)}
												className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded"
											>
												<X className="w-4 h-4" />
											</button>
										</div>
									))}
								</div>
							)}

							{/* Add FAQ inputs */}
							<div className="bg-gray-50 rounded-lg p-4 mb-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
									<input
										type="text"
										value={faqInput.question}
										onChange={(e) => setFaqInput({ ...faqInput, question: e.target.value })}
										className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
										placeholder="Enter question..."
									/>
									<input
										type="text"
										value={faqInput.answer}
										onChange={(e) => setFaqInput({ ...faqInput, answer: e.target.value })}
										className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
										placeholder="Enter answer..."
									/>
								</div>
								<button
									type="button"
									onClick={addFaqEntry}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
								>
									Add FAQ
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	};

	const modalActions = (
		<>
			<button
				type="button"
				onClick={onClose}
				className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
			>
				Cancel
			</button>
			<button
				type="button"
				onClick={handleSave}
				disabled={loading}
				className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? "Updating..." : "Update Course"}
			</button>
		</>
	);

	return (
		<GlobalModal
			isOpen={isOpen}
			onClose={onClose}
			title="Edit Course"
			size="large"
			actions={modalActions}
		>
			<div className="space-y-6">
				{courseFields.map(renderFormField)}

				{/* Published checkbox */}
				<div className="flex items-center">
					<input
						type="checkbox"
						checked={courseFormData.is_published}
						onChange={(e) =>
							setCourseFormData({ ...courseFormData, is_published: e.target.checked })
						}
						className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
					/>
					<label className="text-sm font-medium text-gray-700">
						Course is published
					</label>
				</div>
			</div>
		</GlobalModal>
	);
};

export default CourseEditor;
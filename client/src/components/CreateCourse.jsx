import { X } from "lucide-react";

const CreateCourse = ({
	showCreateCourseModal,
	courseFormData,
	setCourseFormData,
	faqInput,
	setFaqInput,
	addFaqEntry,
	removeFaqEntry,
	setShowCreateCourseModal,
	resetCourseForm,
	handleCreateCourse,
	loading
}) => {
	if (!showCreateCourseModal) return null; // 🔥 Early return for cleaner rendering

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-card rounded-2xl shadow-theme-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-8">
					<h2 className="text-2xl font-bold text-primary mb-6">Create New Course</h2>

					<div className="space-y-6">
						{/* Course Name & Code */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-primary mb-2">
									Course Name *
								</label>
								<input
									type="text"
									value={courseFormData.name}
									onChange={(e) =>
										setCourseFormData({ ...courseFormData, name: e.target.value })
									}
									className="w-full px-4 py-3 bg-card border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
									placeholder="Enter course name"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-primary mb-2">
									Course Code
								</label>
								<input
									type="text"
									value={courseFormData.course_code}
									onChange={(e) =>
										setCourseFormData({
											...courseFormData,
											course_code: e.target.value,
										})
									}
									className="w-full px-4 py-3 bg-card border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
									placeholder="e.g., RCT-ADV-001"
								/>
							</div>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-primary mb-2">
								Description
							</label>
							<textarea
								value={courseFormData.description}
								onChange={(e) =>
									setCourseFormData({
										...courseFormData,
										description: e.target.value,
									})
								}
								rows={4}
								className="w-full px-4 py-3 bg-card border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors resize-none"
								placeholder="Describe what students will learn..."
							/>
						</div>

						{/* Duration, Mode, Commitment */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<label className="block text-sm font-medium text-primary mb-2">
									Duration (weeks) *
								</label>
								<input
									type="number"
									value={courseFormData.duration}
									onChange={(e) =>
										setCourseFormData({
											...courseFormData,
											duration: e.target.value,
										})
									}
									className="w-full px-4 py-3 bg-card border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
									placeholder="8"
									min="1"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-primary mb-2">
									Mode of Learning
								</label>
								<select
									value={courseFormData.mode_of_learning}
									onChange={(e) =>
										setCourseFormData({
											...courseFormData,
											mode_of_learning: e.target.value,
										})
									}
									className="w-full px-4 py-3 bg-card border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
								>
									<option value="online">Online</option>
									<option value="offline">Offline</option>
									<option value="hybrid">Hybrid</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-primary mb-2">
									Commitment (hours/week) *
								</label>
								<input
									type="number"
									value={courseFormData.commitment_time}
									onChange={(e) =>
										setCourseFormData({
											...courseFormData,
											commitment_time: e.target.value,
										})
									}
									className="w-full px-4 py-3 bg-card border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
									placeholder="10"
									min="1"
									required
								/>
							</div>
						</div>

						{/* Requirements */}
						<div>
							<label className="block text-sm font-medium text-primary mb-2">
								Requirements
							</label>
							<textarea
								value={courseFormData.requirements}
								onChange={(e) =>
									setCourseFormData({
										...courseFormData,
										requirements: e.target.value,
									})
								}
								rows={3}
								className="w-full px-4 py-3 bg-card border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors resize-none"
								placeholder="Prerequisites and requirements for this course..."
							/>
						</div>

						{/* Start Date */}
						<div>
							<label className="block text-sm font-medium text-primary mb-2">
								Start Date
							</label>
							<input
								type="date"
								value={courseFormData.start_date}
								onChange={(e) =>
									setCourseFormData({
										...courseFormData,
										start_date: e.target.value,
									})
								}
								className="w-full px-4 py-3 bg-card border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
							/>
						</div>

						{/* FAQ Section */}
						<div>
							<label className="block text-sm font-medium text-primary mb-2">
								Frequently Asked Questions
							</label>

							{/* Add FAQ */}
							<div className="bg-secondary rounded-lg p-4 mb-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
									<input
										type="text"
										value={faqInput.question}
										onChange={(e) =>
											setFaqInput({ ...faqInput, question: e.target.value })
										}
										className="px-3 py-2 bg-card border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
										placeholder="Enter question..."
									/>
									<input
										type="text"
										value={faqInput.answer}
										onChange={(e) =>
											setFaqInput({ ...faqInput, answer: e.target.value })
										}
										className="px-3 py-2 bg-card border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
										placeholder="Enter answer..."
									/>
								</div>
								<button
									type="button"
									onClick={addFaqEntry}
									className="px-4 py-2 button-outline rounded-lg text-sm font-medium"
								>
									Add FAQ
								</button>
							</div>

							{/* Show FAQs */}
							{Object.keys(courseFormData.frequently_asked_questions).length > 0 && (
								<div className="space-y-2 mb-4">
									{Object.entries(courseFormData.frequently_asked_questions).map(
										([question, answer]) => (
											<div
												key={question}
												className="bg-secondary rounded-lg p-3 flex justify-between items-start"
											>
												<div className="flex-1">
													<p className="font-medium text-primary text-sm">{question}</p>
													<p className="text-secondary text-sm mt-1">{answer}</p>
												</div>
												<button
													type="button"
													onClick={() => removeFaqEntry(question)}
													className="ml-2 p-1 text-error hover:bg-error hover:bg-opacity-10 rounded"
												>
													<X className="w-4 h-4" />
												</button>
											</div>
										)
									)}
								</div>
							)}
						</div>

						{/* Publish Checkbox */}
						<div className="flex items-center">
							<input
								type="checkbox"
								id="is_published"
								checked={courseFormData.is_published}
								onChange={(e) =>
									setCourseFormData({
										...courseFormData,
										is_published: e.target.checked,
									})
								}
								className="mr-2"
							/>
							<label htmlFor="is_published" className="text-sm font-medium text-primary">
								Publish course immediately
							</label>
						</div>

						{/* Footer Buttons */}
						<div className="flex items-center justify-end space-x-4 pt-6 border-t border-primary">
							<button
								type="button"
								onClick={() => {
									setShowCreateCourseModal(false);
									resetCourseForm();
								}}
								className="px-6 py-3 button-outline rounded-lg font-medium transition-colors"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleCreateCourse}
								disabled={loading}
								className="px-6 py-3 button-primary rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? "Creating..." : "Create Course"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateCourse;
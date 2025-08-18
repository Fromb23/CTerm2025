import React, { useState } from "react";
import Button from "./ui/Button";
import Form from "./ui/Form";
import Input from "./ui/Input";

const CourseFormModal = ({ onClose, onSubmit }) => {
	const initialData = {
		name: "",
		description: "",
		start_date: "",
		estimated_duration: "",
		commitment_time: "",
		requirements: "",
		frequently_asked_questions: [],
	};

	const [formData, setFormData] = useState(initialData);

	// Generic input handler
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// FAQs handlers
	const addFaq = () =>
		setFormData((prev) => ({
			...prev,
			frequently_asked_questions: [...prev.frequently_asked_questions, { question: "", answer: "" }],
		}));

	const updateFaq = (index, field, value) =>
		setFormData((prev) => ({
			...prev,
			frequently_asked_questions: prev.frequently_asked_questions.map((faq, i) =>
				i === index ? { ...faq, [field]: value } : faq
			),
		}));

	const removeFaq = (index) =>
		setFormData((prev) => ({
			...prev,
			frequently_asked_questions: prev.frequently_asked_questions.filter((_, i) => i !== index),
		}));

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
		onClose();
	};

	// Fields array for Form component
	const fields = [
		{ label: "Course Name", name: "name", required: true },
		{ label: "Description", name: "description", type: "textarea" },
		{ label: "Start Date", name: "start_date", type: "date", required: true },
		{ label: "Estimated Duration (weeks)", name: "estimated_duration" },
		{ label: "Commitment Time (hrs/week)", name: "commitment_time", type: "number" },
		{ label: "Requirements", name: "requirements", type: "textarea" },
	];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
			<div className="bg-card p-6 rounded-lg w-full max-w-md shadow-theme-lg max-h-[90vh] overflow-y-auto">
				<h2 className="text-xl font-bold mb-4">Create Course</h2>
				<Form fields={fields} formData={formData} onChange={handleInputChange} onSubmit={handleSubmit}>
					{/* FAQs */}
					<div className="flex flex-col gap-2">
						<h3 className="font-semibold">FAQs</h3>
						{formData.frequently_asked_questions.map((faq, idx) => (
							<div key={idx} className="flex flex-col gap-1 border p-2 rounded">
								<Input
									name={`question-${idx}`}
									placeholder="Question"
									value={faq.question}
									onChange={(e) => updateFaq(idx, "question", e.target.value)}
								/>
								<Input
									name={`answer-${idx}`}
									placeholder="Answer"
									value={faq.answer}
									onChange={(e) => updateFaq(idx, "answer", e.target.value)}
									type="textarea"
								/>
								<Button type="button" variant="secondary" onClick={() => removeFaq(idx)}>
									Remove FAQ
								</Button>
							</div>
						))}
						<Button type="button" onClick={addFaq}>
							+ Add FAQ
						</Button>
					</div>

					<div className="flex justify-end gap-2 mt-4">
						<Button type="button" variant="secondary" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit">Save</Button>
					</div>
				</Form>
			</div>
		</div>
	);
};

export default CourseFormModal;

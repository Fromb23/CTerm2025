import React from "react";
import {
	BookOpen, Globe, User, Monitor, Eye, Edit, Trash2, CheckCircle, AlertCircle
} from "lucide-react";

// Mock data
export const mockCourses = [
	{
		id: 1,
		name: "Advanced React Development",
		course_code: "RCT-ADV-001",
		duration: 8,
		mode_of_learning: "online",
		commitment_time: 10,
		requirements: "Basic knowledge of JavaScript and React fundamentals",
		description: "Master React with hooks, context, and modern patterns. Build scalable applications with best practices.",
		start_date: "2024-02-01T09:00:00Z",
		is_published: true,
		created_at: "2024-01-15T10:30:00Z",
		updated_at: "2024-01-20T14:20:00Z"
	},
	{
		id: 2,
		name: "Python for Data Science",
		course_code: "PY-DS-001",
		duration: 12,
		mode_of_learning: "hybrid",
		commitment_time: 8,
		requirements: "Basic programming knowledge preferred",
		description: "Learn Python programming for data analysis, visualization, and machine learning applications.",
		start_date: "2024-01-15T09:00:00Z",
		is_published: true,
		created_at: "2024-01-01T08:00:00Z",
		updated_at: "2024-01-10T16:45:00Z"
	},
	{
		id: 3,
		name: "UI/UX Design Fundamentals",
		course_code: "UX-FUND-001",
		duration: 6,
		mode_of_learning: "offline",
		commitment_time: 12,
		requirements: "Design thinking mindset and creativity",
		description: "Complete guide to user interface and user experience design principles and practices.",
		start_date: "2024-03-01T09:00:00Z",
		is_published: false,
		created_at: "2024-02-01T12:15:00Z",
		updated_at: "2024-02-15T09:30:00Z"
	},
	{
		id: 4,
		name: "Digital Marketing Strategy",
		course_code: "DM-STRAT-001",
		duration: 10,
		mode_of_learning: "online",
		commitment_time: 6,
		requirements: "Basic understanding of marketing concepts",
		description: "Comprehensive digital marketing course covering SEO, social media, and analytics.",
		start_date: "2024-04-01T09:00:00Z",
		is_published: true,
		created_at: "2024-03-01T11:00:00Z",
		updated_at: "2024-03-10T15:30:00Z"
	}
];

export const mockEnrollments = [
	{
		id: 'uuid-1',
		user: { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
		course: mockCourses[0],
		enrolled_on: "2024-02-01T10:00:00Z",
		completed_on: null,
		status: 'active',
		updated_at: "2024-02-10T14:30:00Z",
		is_active: true,
		completion_percentage: 65.5
	},
	{
		id: 'uuid-2',
		user: { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
		course: mockCourses[0],
		enrolled_on: "2024-02-02T11:00:00Z",
		completed_on: null,
		status: 'paused',
		updated_at: "2024-02-15T16:20:00Z",
		is_active: true,
		completion_percentage: 45.0
	},
	{
		id: 'uuid-3',
		user: { id: 3, first_name: 'Mike', last_name: 'Wilson', email: 'mike@example.com' },
		course: mockCourses[1],
		enrolled_on: "2024-01-15T09:30:00Z",
		completed_on: "2024-03-15T17:45:00Z",
		status: 'completed',
		updated_at: "2024-03-15T17:45:00Z",
		is_active: true,
		completion_percentage: 100.0
	},
	{
		id: 'uuid-4',
		user: { id: 4, first_name: 'Sarah', last_name: 'Johnson', email: 'sarah@example.com' },
		course: mockCourses[1],
		enrolled_on: "2024-01-20T14:00:00Z",
		completed_on: null,
		status: 'active',
		updated_at: "2024-02-20T10:15:00Z",
		is_active: true,
		completion_percentage: 78.5
	},
	{
		id: 'uuid-5',
		user: { id: 5, first_name: 'Alex', last_name: 'Brown', email: 'alex@example.com' },
		course: mockCourses[3],
		enrolled_on: "2024-04-01T09:00:00Z",
		completed_on: null,
		status: 'active',
		updated_at: "2024-04-10T12:00:00Z",
		is_active: true,
		completion_percentage: 23.0
	}
];

// Helper function to get mode icon
export const getModeIcon = (mode) => {
	switch (mode) {
		case 'online': return <Globe className="w-4 h-4" />;
		case 'offline': return <User className="w-4 h-4" />;
		case 'hybrid': return <Monitor className="w-4 h-4" />;
		default: return <BookOpen className="w-4 h-4" />;
	}
};

// Function to generate table columns
export const getTableColumns = ({ handleViewCourse, handleEditCourse, handleDeleteCourse, getModeIcon }) => {
	return [
		{
			header: "Course Details",
			accessorKey: "name",
			cell: (info) => {
				const row = info.row.original;
				return (
					<div className="flex flex-col">
						<span className="font-semibold text-primary text-sm">{row.name}</span>
						<span className="text-xs text-secondary">{row.courseCode}</span>
					</div>
				);
			},
		},
		{
			header: "Duration & Time",
			accessorKey: "duration",
			cell: (info) => {
				const row = info.row.original;
				return (
					<div className="flex flex-col">
						<span className="text-sm text-primary">{row.duration}</span>
						<span className="text-xs text-secondary">{row.commitmentTime}</span>
					</div>
				);
			},
		},
		{
			header: "Learning Mode",
			accessorKey: "mode",
			cell: (info) => {
				const mode = info.getValue();
				return (
					<div className="flex items-center space-x-2">
						{getModeIcon(mode)}
						<span className="capitalize text-sm">{mode}</span>
					</div>
				);
			},
		},
		{
			header: "Students",
			accessorKey: "totalStudents",
			cell: (info) => {
				const row = info.row.original;
				return (
					<div className="flex flex-col">
						<span className="text-sm font-medium text-primary">{row.totalStudents} Total</span>
						<div className="flex space-x-3 text-xs">
							<span className="text-success">{row.activeStudents} Active</span>
							<span className="text-info">{row.completedStudents} Completed</span>
						</div>
					</div>
				);
			},
		},
		{
			header: "Progress",
			accessorKey: "avgCompletion",
			cell: (info) => {
				const completion = parseFloat(info.getValue().replace('%', ''));
				return (
					<div className="flex items-center space-x-2">
						<div className="w-16 bg-secondary rounded-full h-2">
							<div
								className="bg-accent h-2 rounded-full transition-all duration-300"
								style={{ width: `${completion}%` }}
							></div>
						</div>
						<span className="text-sm font-medium">{info.getValue()}</span>
					</div>
				);
			},
		},
		{
			header: "Status",
			accessorKey: "published",
			cell: (info) => {
				const status = info.getValue();
				return (
					<span
						className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status === "Published"
							? "bg-success text-white"
							: "bg-warning text-white"
							}`}
					>
						{status === "Published" ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
						{status}
					</span>
				);
			},
		},
		{
			header: "Start Date",
			accessorKey: "startDate",
			cell: (info) => (
				<span className="text-sm text-secondary">{info.getValue()}</span>
			),
		},
		{
			header: "Actions",
			id: "actions",
			cell: (info) => {
				const courseId = info.row.original.id;
				return (
					<div className="flex items-center space-x-2">
						<button
							onClick={() => handleViewCourse(courseId)}
							className="p-1 hover:bg-secondary rounded-lg transition-colors group"
							title="View Course Details"
						>
							<Eye className="w-4 h-4 text-info group-hover:text-info" />
						</button>
						<button
							onClick={() => handleEditCourse(courseId)}
							className="p-1 hover:bg-secondary rounded-lg transition-colors group"
							title="Edit Course"
						>
							<Edit className="w-4 h-4 text-accent group-hover:text-accent" />
						</button>
						<button
							onClick={() => handleDeleteCourse(courseId)}
							className="p-1 hover:bg-secondary rounded-lg transition-colors group"
							title="Delete Course"
						>
							<Trash2 className="w-4 h-4 text-error group-hover:text-error" />
						</button>
					</div>
				);
			},
		},
	];
};
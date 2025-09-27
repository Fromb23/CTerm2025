import { Users, Activity, Award, TrendingUp } from "lucide-react";

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

export const mockUsers = [
	{ id: 1, username: 'john_doe', email: 'john@example.com', first_name: 'John', last_name: 'Doe' },
	{ id: 2, username: 'jane_smith', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith' },
	{ id: 3, username: 'mike_wilson', email: 'mike@example.com', first_name: 'Mike', last_name: 'Wilson' }
];

export const mockEnrollments = [
	{
		id: 1,
		user: mockUsers[0],
		course: mockCourses[0],
		enrolled_on: "2024-02-01T10:00:00Z",
		completed_on: null,
		status: 'active',
		updated_at: "2024-02-10T14:30:00Z",
		is_active: true,
		completion_percentage: 65.5
	},
	{
		id: 2,
		user: mockUsers[1],
		course: mockCourses[0],
		enrolled_on: "2024-02-02T11:00:00Z",
		completed_on: null,
		status: 'paused',
		updated_at: "2024-02-15T16:20:00Z",
		is_active: true,
		completion_percentage: 45.0
	},
	{
		id: 3,
		user: mockUsers[2],
		course: mockCourses[1],
		enrolled_on: "2024-01-15T09:30:00Z",
		completed_on: "2024-03-15T17:45:00Z",
		status: 'completed',
		updated_at: "2024-03-15T17:45:00Z",
		is_active: true,
		completion_percentage: 100.0
	},
	{
		id: 4,
		user: mockUsers[0],
		course: mockCourses[1],
		enrolled_on: "2024-01-20T14:00:00Z",
		completed_on: null,
		status: 'withdrawn',
		updated_at: "2024-02-20T10:15:00Z",
		is_active: false,
		completion_percentage: 25.0
	}
];

export const mockSprints = [
	{
		id: 1,
		name: "React Basics",
		duration: 2, // weeks
		start_date: "2024-02-01T09:00:00Z",
		end_date: "2024-02-14T17:00:00Z",
		description: "Introduction to React, components, and JSX.",
		course: 1,
		is_active: true,
		created_at: "2024-01-15T10:30:00Z",
		updated_at: "2024-01-20T14:20:00Z",
	},
	{
		id: 2,
		name: "State Management",
		duration: 2,
		start_date: "2024-02-15T09:00:00Z",
		end_date: "2024-02-28T17:00:00Z",
		description: "Understanding state, props, and context in React.",
		course: 1,
		is_active: false,
		created_at: "2024-01-20T10:00:00Z",
		updated_at: "2024-01-25T16:45:00Z",
	},
	{
		id: 3,
		name: "Python Basics",
		duration: 2,
		start_date: "2024-01-15T09:00:00Z",
		end_date: "2024-01-28T17:00:00Z",
		description: "Introduction to Python programming and syntax.",
		course: 2,
		is_active: false,
		created_at: "2024-01-01T08:00:00Z",
		updated_at: "2024-01-10T16:45:00Z",
	},
	{
		id: 4,
		name: "Data Analysis with Pandas",
		duration: 2,
		start_date: "2024-01-29T09:00:00Z",
		end_date: "2024-02-11T17:00:00Z",
		description: "Using Pandas for data manipulation and analysis.",
		course: 2,
		is_active: false,
		created_at: "2024-01-15T10:30:00Z",
		updated_at: "2024-01-20T14:20:00Z",
	},
	{
		id: 5,
		name: "UI Design Principles",
		duration: 2,
		start_date: "2024-03-01T09:00:00Z",
		end_date: "2024-03-14T17:00:00Z",
		description: "Fundamentals of user interface design.",
		course: 3,
		is_active: false,
		created_at: "2024-02-01T12:15:00Z",
		updated_at: "2024-02-15T09:30:00Z",
	},
	{
		id: 6,
		name: "UX Research Methods",
		duration: 2,
		start_date: "2024-03-15T09:00:00Z",
		end_date: "2024-03-28T17:00:00Z",
		description: "Techniques for user experience research.",
		course: 3,
		is_active: false,
		created_at: "2024-02-15T10:30:00Z",
		updated_at: "2024-02-20T14:20:00Z",
	},
];

export const courseStatsValues = {
  totalEnrollments: 1234,
  activeEnrollments: 980,
  completedEnrollments: 720,
  avgCompletionRate: 87,
};

export const courseStatsData = [
  {
    label: "Total Enrollments",
    value: courseStatsValues.totalEnrollments,
    icon: Users,
    color: "text-accent",
    valueColor: "text-primary",
  },
  {
    label: "Active Students",
    value: courseStatsValues.activeEnrollments,
    icon: Activity,
    color: "text-success",
    valueColor: "text-success",
  },
  {
    label: "Completed",
    value: courseStatsValues.completedEnrollments,
    icon: Award,
    color: "text-info",
    valueColor: "text-info",
  },
  {
    label: "Avg Progress",
    value: `${courseStatsValues.avgCompletionRate}%`,
    icon: TrendingUp,
    color: "text-warning",
    valueColor: "text-warning",
  },
];
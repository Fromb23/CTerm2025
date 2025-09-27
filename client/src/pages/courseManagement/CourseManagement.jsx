import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Users, TrendingUp, Clock, Plus, Search, Filter, BarChart3
} from "lucide-react";
import Table from "../../components/Table";
import CreateCourse from "../../components/CreateCourse";
import Loading from "../../components/ui/Loading";
import CourseEditor from "./CourseEditor";

import {
  mockCourses,
  mockEnrollments,
  getModeIcon,
  getTableColumns
} from "./courseManagementUtils";

const CourseManagement = () => {
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
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
    is_published: false
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [faqInput, setFaqInput] = useState({ question: '', answer: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const navigate = useNavigate();

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const totalCourses = mockCourses.length;
    const publishedCourses = mockCourses.filter(c => c.is_published).length;
    const draftCourses = totalCourses - publishedCourses;
    const totalEnrollments = mockEnrollments.length;
    const activeEnrollments = mockEnrollments.filter(e => e.status === 'active').length;
    const completedEnrollments = mockEnrollments.filter(e => e.status === 'completed').length;
    const avgCompletionRate = totalEnrollments > 0
      ? mockEnrollments.reduce((sum, e) => sum + e.completion_percentage, 0) / totalEnrollments
      : 0;
    const avgCourseDuration = mockCourses.reduce((sum, c) => sum + c.duration, 0) / totalCourses;

    // Learning mode distribution
    const modeStats = mockCourses.reduce((acc, course) => {
      acc[course.mode_of_learning] = (acc[course.mode_of_learning] || 0) + 1;
      return acc;
    }, {});

    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      avgCompletionRate: Math.round(avgCompletionRate),
      avgCourseDuration: Math.round(avgCourseDuration),
      modeStats
    };
  }, []);

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

  const handleCreateCourse = () => {
    setShowCreateCourseModal(true);
  }

  const resetCourseForm = () => {
    setCourseFormData({
      name: '',
      course_code: '',
      duration: '',
      mode_of_learning: 'online',
      commitment_time: '',
      requirements: '',
      description: '',
      frequently_asked_questions: {},
      start_date: '',
      is_published: false
    });
    setFaqInput({ question: '', answer: '' });
  };

  // Enhanced table data with filtering
  const tableData = useMemo(() => {
    let filteredCourses = mockCourses;

    // Apply search filter
    if (searchTerm) {
      filteredCourses = filteredCourses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'published') {
        filteredCourses = filteredCourses.filter(c => c.is_published);
      } else if (statusFilter === 'draft') {
        filteredCourses = filteredCourses.filter(c => !c.is_published);
      }
    }

    // Apply mode filter
    if (modeFilter !== 'all') {
      filteredCourses = filteredCourses.filter(c => c.mode_of_learning === modeFilter);
    }

    return filteredCourses.map((course) => {
      const courseEnrollments = mockEnrollments.filter(
        (enroll) => enroll.course.id === course.id
      );

      const totalStudents = courseEnrollments.length;
      const avgCompletion =
        totalStudents > 0
          ? (
            courseEnrollments.reduce(
              (sum, e) => sum + e.completion_percentage,
              0
            ) / totalStudents
          ).toFixed(1)
          : 0;

      const activeStudents = courseEnrollments.filter(
        (e) => e.status === "active"
      ).length;

      const completedStudents = courseEnrollments.filter(
        (e) => e.status === "completed"
      ).length;

      return {
        id: course.id,
        name: course.name,
        courseCode: course.course_code,
        duration: `${course.duration} weeks`,
        mode: course.mode_of_learning,
        commitmentTime: `${course.commitment_time}h/week`,
        totalStudents,
        activeStudents,
        completedStudents,
        avgCompletion: `${avgCompletion}%`,
        published: course.is_published ? "Published" : "Draft",
        startDate: new Date(course.start_date).toLocaleDateString(),
        course: course // Include full course object for actions
      };
    });
  }, [searchTerm, statusFilter, modeFilter]);

  const handleViewCourse = (courseId) => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  const handleEditCourse = (courseId) => {
  const course = mockCourses?.find(c => c.id === courseId);
  setEditingCourse(course);
  setShowEditModal(true);
};

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      console.log('Delete course:', courseId);
      // Handle deletion logic
    }
  };

  // Get columns with handlers
  const columns = getTableColumns({
    handleViewCourse,
    handleEditCourse,
    handleDeleteCourse,
    getModeIcon
  });

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Course Management</h1>
            <p className="text-secondary">
              Comprehensive overview of all courses, enrollments, and performance metrics.
            </p>
          </div>
          <button
            className="flex items-center px-6 py-3 button-primary rounded-lg font-medium hover:shadow-theme-lg transition-all"
            onClick={handleCreateCourse}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Course
          </button>
        </div>

        {/* Key Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Total Courses</p>
                <p className="text-2xl font-bold text-primary">{stats.totalCourses}</p>
                <p className="text-xs text-secondary mt-1">
                  {stats.publishedCourses} Published, {stats.draftCourses} Draft
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-accent" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Total Enrollments</p>
                <p className="text-2xl font-bold text-primary">{stats.totalEnrollments}</p>
                <p className="text-xs text-secondary mt-1">
                  {stats.activeEnrollments} Active, {stats.completedEnrollments} Completed
                </p>
              </div>
              <Users className="w-8 h-8 text-info" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Avg. Completion Rate</p>
                <p className="text-2xl font-bold text-primary">{stats.avgCompletionRate}%</p>
                <p className="text-xs text-success mt-1">
                  Across all active enrollments
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Avg. Course Duration</p>
                <p className="text-2xl font-bold text-primary">{stats.avgCourseDuration} weeks</p>
                <p className="text-xs text-secondary mt-1">
                  Average across all courses
                </p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </div>
        </div>

        {/* Learning Mode Distribution */}
        <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Learning Mode Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.modeStats).map(([mode, count]) => (
              <div key={mode} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center space-x-2">
                  {getModeIcon(mode)}
                  <span className="capitalize font-medium text-primary">{mode}</span>
                </div>
                <span className="text-lg font-bold text-accent">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="text"
                placeholder="Search courses by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-secondary border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-secondary" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-secondary border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="px-4 py-3 bg-secondary border border-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
              >
                <option value="all">All Modes</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-card rounded-xl border border-primary shadow-theme overflow-hidden">
          <div className="p-6 border-b border-primary">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Courses Overview ({tableData.length})
              </h2>
              <div className="text-sm text-secondary">
                Click on any row to view course details and manage enrollments
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              data={tableData}
              onRowClick={(row) => handleViewCourse(row.original.id)}
            />
          </div>
        </div>
        <CreateCourse
          showCreateCourseModal={showCreateCourseModal}
          setShowCreateCourseModal={setShowCreateCourseModal}
          courseFormData={courseFormData}
          setCourseFormData={setCourseFormData}
          faqInput={faqInput}
          setFaqInput={setFaqInput}
          addFaqEntry={addFaqEntry}
          removeFaqEntry={removeFaqEntry}
          resetCourseForm={resetCourseForm}
          handleCreateCourse={handleCreateCourse}
          loading={Loading}
        />
        <CourseEditor
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            course={editingCourse}
            onSave={handleEditCourse}
            loading={Loading}
          />
      </div>
    </div>
  );
};

export default CourseManagement;
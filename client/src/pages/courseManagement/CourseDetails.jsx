import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, Edit3, Trash2, BookOpen, Clock, Calendar, Users,
  Globe, User, Monitor, Eye, Share
} from 'lucide-react';
import { mockCourses, mockEnrollments, mockSprints, courseStatsData } from './data';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import HeaderDashboard from '../../components/layout/HeaderDashboard';
import Card from '../../components/Card';
import CourseEditor from './CourseEditor';

const CourseDetail = ({
  setCourses,
  setEnrollments,
  courses,
  enrollments,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Find the current course
  const course = useMemo(() => {
    return mockCourses?.find(c => c.id === parseInt(courseId));
  }, [courseId]);

  const navigateToEnrollments = (courseId) => {
    navigate(`/dashboard/courses/${courseId}/enrollments`);
  };

  const onNavigateToEnrollments = (courseId) => {
    navigate(`/dashboard/courses/${courseId}/enrollments`);
  };

  // Get course-specific enrollments and stats
  const courseEnrollments = useMemo(() => {
    return mockEnrollments?.filter(enrollment => enrollment.course.id === parseInt(courseId));
  }, [courseId]);

  const courseStats = useMemo(() => {
    const totalEnrollments = courseEnrollments?.length;
    const activeEnrollments = courseEnrollments?.filter(e => e.status === 'active').length;
    const completedEnrollments = courseEnrollments?.filter(e => e.status === 'completed').length;
    const pausedEnrollments = courseEnrollments?.filter(e => e.status === 'paused').length;
    const withdrawnEnrollments = courseEnrollments?.filter(e => e.status === 'withdrawn').length;

    const avgCompletionRate = totalEnrollments > 0
      ? courseEnrollments?.reduce((sum, e) => sum + e.completion_percentage, 0) / totalEnrollments
      : 0;

    const recentEnrollments = courseEnrollments
      ?.sort((a, b) => new Date(b.enrolled_on) - new Date(a.enrolled_on))
      ?.slice(0, 5);

    return {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      pausedEnrollments,
      withdrawnEnrollments,
      avgCompletionRate: Math.round(avgCompletionRate),
      recentEnrollments
    };
  }, [courseEnrollments]);

  // Sprint columns
  const sprintColumns = [
    { header: "Name", accessorKey: "name" },
    { header: "Duration (weeks)", accessorKey: "duration" },
    {
      header: "Start Date", accessorKey: "start_date",
      cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString()
    },
    {
      header: "End Date", accessorKey: "end_date", cell: ({ row }) =>
        row.original.end_date
          ? new Date(row.original.end_date).toLocaleDateString()
          : "N/A",
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: ({ row }) => (row.original.is_active ? "Active" : "Inactive"),
    },
    {
      header: "Created",
      accessorKey: "created_at",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
  ];

  const onNavigateBack = () => {
    navigate('/dashboard/courses/');
  };

  const handleEditCourse = async (formData) => {
    setLoading(true);
    try {
      const updatedCourses = courses.map(c =>
        c.id === course.id ? {
          ...c,
          ...formData,
          duration: parseInt(formData.duration),
          commitment_time: parseInt(formData.commitment_time),
          updated_at: new Date().toISOString()
        } : c
      );

      setCourses(updatedCourses);
      setShowEditModal(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating course:', error);
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (window.confirm('Are you sure you want to delete this course? This will also remove all related enrollments.')) {
      try {
        setCourses(courses.filter(c => c.id !== course.id));
        setEnrollments(enrollments.filter(enrollment => enrollment.course.id !== course.id));
        onNavigateBack();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleTogglePublish = async () => {
    setLoading(true);
    try {
      const updatedCourses = courses.map(c =>
        c.id === course.id ? {
          ...c,
          is_published: !c.is_published,
          updated_at: new Date().toISOString()
        } : c
      );
      setCourses(updatedCourses);
      setLoading(false);
    } catch (error) {
      console.error('Error updating course status:', error);
      setLoading(false);
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'online': return <Globe className="w-5 h-5" />;
      case 'offline': return <User className="w-5 h-5" />;
      case 'hybrid': return <Monitor className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'paused': return 'text-warning';
      case 'completed': return 'text-info';
      case 'withdrawn': return 'text-error';
      default: return 'text-default';
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-primary mb-2">Course not found</h3>
            <p className="text-secondary mb-6">The requested course could not be found.</p>
            <button
              onClick={onNavigateBack}
              className="px-6 py-3 button-primary rounded-lg font-medium"
            >
              Back to Course Management
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary text-primary">
      <HeaderDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        className="shadow-md mb-4 bg-card"
      />

      <div className="min-h-screen bg-primary p-6">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header with Breadcrumb */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onNavigateBack}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-secondary" />
              </button>
              <div>
                <div className="flex items-center space-x-2 text-sm text-secondary mb-1">
                  <span>Course Management</span>
                  <span>/</span>
                  <span className="text-primary">{course.name}</span>
                </div>
                <h1 className="text-3xl font-bold text-primary">{course.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-secondary">{course.course_code}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.is_published ? 'bg-success text-white' : 'bg-warning text-white'}`}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleTogglePublish}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${course.is_published
                  ? 'button-outline'
                  : 'button-primary'
                  }`}
              >
                {course.is_published ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 button-outline rounded-lg font-medium hover:shadow-theme transition-all"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Course
              </button>
              <button
                onClick={handleDeleteCourse}
                className="px-4 py-2 button-destructive rounded-lg font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          {/* Course Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {courseStatsData?.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-secondary text-sm">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Details */}
            <div className="lg:col-span-2 space-y-6">

              {/* Course Overview */}
              <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
                <h2 className="text-xl font-semibold text-primary mb-6">Course Overview</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-secondary mb-2">Description</h3>
                    <p className="text-primary">{course.description || 'No description provided'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-secondary mb-2">Learning Mode</h3>
                      <div className="flex items-center space-x-2">
                        {getModeIcon(course.mode_of_learning)}
                        <span className="capitalize text-primary font-medium">
                          {course.mode_of_learning}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-secondary mb-2">Duration</h3>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-secondary" />
                        <span className="text-primary font-medium">{course.duration} weeks</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-secondary mb-2">Time Commitment</h3>
                      <span className="text-primary font-medium">{course.commitment_time}h/week</span>
                    </div>
                    {course.start_date && (
                      <div>
                        <h3 className="text-sm font-medium text-secondary mb-2">Start Date</h3>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-secondary" />
                          <span className="text-primary font-medium">{formatDate(course.start_date)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {course.requirements && (
                    <div>
                      <h3 className="text-sm font-medium text-secondary mb-2">Requirements</h3>
                      <p className="text-primary">{course.requirements}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sprint Table for this course */}
              <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
                <h2 className="text-xl font-semibold text-primary mb-6">Sprints Overview</h2>
                <Table
                  columns={sprintColumns}
                  data={mockSprints?.filter(
                    (sprint) => sprint.course === course.id
                  )}
                />
              </div>

              {/* FAQs */}
              {course.frequently_asked_questions && Object.keys(course.frequently_asked_questions).length > 0 && (
                <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
                  <h2 className="text-xl font-semibold text-primary mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {Object.entries(course.frequently_asked_questions).map(([question, answer]) => (
                      <div key={question} className="bg-secondary rounded-lg p-4">
                        <h3 className="font-medium text-primary mb-2">{question}</h3>
                        <p className="text-secondary">{answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigateToEnrollments(courseId)}
                    className="w-full flex items-center px-4 py-3 button-primary rounded-lg font-medium"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    Manage Enrollments ({courseStats.totalEnrollments})
                  </button>
                  <button className="w-full flex items-center px-4 py-3 button-outline rounded-lg font-medium">
                    <Eye className="w-5 h-5 mr-3" />
                    Preview Course
                  </button>
                  <button className="w-full flex items-center px-4 py-3 button-outline rounded-lg font-medium">
                    <Share className="w-5 h-5 mr-3" />
                    Share Course
                  </button>
                </div>
              </div>

              {/* Recent Enrollments */}
              {courseStats.recentEnrollments.length > 0 && (
                <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-primary">Recent Enrollments</h3>
                    <button
                      onClick={() => onNavigateToEnrollments(courseId)}
                      className="text-sm text-accent hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {courseStats.recentEnrollments.map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-primary">
                            {enrollment.user.first_name} {enrollment.user.last_name}
                          </p>
                          <p className="text-xs text-secondary">{formatDate(enrollment.enrolled_on)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-medium ${getStatusColor(enrollment.status)} capitalize`}>
                            {enrollment.status}
                          </span>
                          <p className="text-xs text-secondary">{enrollment.completion_percentage.toFixed(0)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Metadata */}
              <div className="bg-card rounded-xl border border-primary shadow-theme p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Course Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Created:</span>
                    <span className="text-primary">{formatDate(course.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Last Updated:</span>
                    <span className="text-primary">{formatDate(course.updated_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Status:</span>
                    <span className={`font-medium ${course.is_published ? 'text-success' : 'text-warning'}`}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Course Modal */}
          <CourseEditor
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            course={course}
            onSave={handleEditCourse}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
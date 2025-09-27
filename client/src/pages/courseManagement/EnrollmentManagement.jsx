import React, { useState, useEffect } from 'react';
import {
  Plus, Users, Clock, Activity, Award, TrendingUp, Search, Filter, RefreshCw, Pause
} from 'lucide-react';
import { mockEnrollments } from './data';
import { useParams } from 'react-router-dom';
import EnrollmentCard from './EnrollmentCard';
import EnrollmentEditor from './EnrollmenEditor';

const EnrollmentManagement = () => {
  const { courseId } = useParams();
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const filtered = mockEnrollments?.filter(
      (enrollment) => enrollment?.course?.id.toString() === courseId
    );
    setEnrollments(filtered);
  }, [courseId]);

  const [users] = useState([
    { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', username: 'johndoe' },
    { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', username: 'janesmith' },
    { id: 3, first_name: 'Mike', last_name: 'Johnson', email: 'mike@example.com', username: 'mikej' },
  ]);

  const [courses] = useState([
    { id: 1, name: 'React Fundamentals', course_code: 'REACT-101', duration: 8, mode_of_learning: 'online', is_published: true },
    { id: 2, name: 'Python for Beginners', course_code: 'PY-101', duration: 12, mode_of_learning: 'hybrid', is_published: true },
    { id: 3, name: 'Machine Learning Basics', course_code: 'ML-101', duration: 16, mode_of_learning: 'offline', is_published: true },
  ]);

  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showEnrollmentDetailsModal, setShowEnrollmentDetailsModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [notification, setNotification] = useState(null);

  const [enrollmentFormData, setEnrollmentFormData] = useState({
    user_id: '',
    course_id: '',
    status: 'active',
    completion_percentage: 0
  });

  // Calculate enrollment statistics
  const enrollmentStats = {
    total: enrollments.length,
    active: enrollments.filter(e => e.status === 'active').length,
    completed: enrollments.filter(e => e.status === 'completed').length,
    paused: enrollments.filter(e => e.status === 'paused').length,
    pending: enrollments.filter(e => e.status === 'pending').length,
    withdrawn: enrollments.filter(e => e.status === 'withdrawn').length,
    avgProgress: enrollments.length > 0 ?
      (enrollments.reduce((sum, e) => sum + e.completion_percentage, 0) / enrollments.length).toFixed(1) : 0
  };

  useEffect(() => {
    filterEnrollments();
  }, [enrollments, searchTerm, filterStatus]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filterEnrollments = () => {
    let filtered = enrollments;

    if (searchTerm) {
      filtered = filtered.filter(enrollment =>
        enrollment.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.status === filterStatus);
    }

    setFilteredEnrollments(filtered);
  };

  const handleCreateEnrollment = async () => {
    if (!enrollmentFormData.user_id || !enrollmentFormData.course_id) {
      showNotification('Please select both user and course', 'error');
      return;
    }

    // Check if user is already enrolled in this course
    const existingEnrollment = enrollments.find(e =>
      e.user.id === parseInt(enrollmentFormData.user_id) &&
      e.course.id === parseInt(enrollmentFormData.course_id) &&
      e.is_active
    );

    if (existingEnrollment) {
      showNotification('User is already enrolled in this course', 'error');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = users.find(u => u.id === parseInt(enrollmentFormData.user_id));
      const course = courses.find(c => c.id === parseInt(enrollmentFormData.course_id));

      const newEnrollment = {
        id: `uuid-${Date.now()}`,
        user,
        course,
        enrolled_on: new Date().toISOString(),
        completed_on: null,
        status: enrollmentFormData.status,
        updated_at: new Date().toISOString(),
        is_active: true,
        completion_percentage: parseFloat(enrollmentFormData.completion_percentage) || 0
      };

      setEnrollments([...enrollments, newEnrollment]);
      setShowEnrollmentModal(false);
      resetEnrollmentForm();
      showNotification(`Successfully enrolled ${user.first_name} ${user.last_name} in ${course.name}`);
    } catch (error) {
      console.error('Error creating enrollment:', error);
      showNotification('Failed to create enrollment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEnrollmentStatus = async (enrollmentId, newStatus) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedEnrollments = enrollments.map(enrollment => {
        if (enrollment.id === enrollmentId) {
          const updatedEnrollment = {
            ...enrollment,
            status: newStatus,
            updated_at: new Date().toISOString()
          };

          if (newStatus === 'completed') {
            updatedEnrollment.completed_on = new Date().toISOString();
            updatedEnrollment.completion_percentage = 100.0;
          } else if (newStatus === 'withdrawn') {
            updatedEnrollment.is_active = false;
          } else {
            updatedEnrollment.is_active = true;
            if (enrollment.status === 'withdrawn') {
              updatedEnrollment.is_active = true;
            }
          }

          return updatedEnrollment;
        }
        return enrollment;
      });

      setEnrollments(updatedEnrollments);
      showNotification(`Enrollment status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      showNotification('Failed to update enrollment status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (enrollmentId, newProgress) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedEnrollments = enrollments.map(enrollment => {
        if (enrollment.id === enrollmentId) {
          return {
            ...enrollment,
            completion_percentage: parseFloat(newProgress),
            updated_at: new Date().toISOString(),
            ...(parseFloat(newProgress) === 100 ? {
              status: 'completed',
              completed_on: new Date().toISOString()
            } : {})
          };
        }
        return enrollment;
      });

      setEnrollments(updatedEnrollments);
      showNotification('Progress updated successfully');
    } catch (error) {
      console.error('Error updating progress:', error);
      showNotification('Failed to update progress', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (window.confirm('Are you sure you want to permanently delete this enrollment?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        setEnrollments(enrollments.filter(enrollment => enrollment.id !== enrollmentId));
        showNotification('Enrollment deleted successfully');
      } catch (error) {
        console.error('Error deleting enrollment:', error);
        showNotification('Failed to delete enrollment', 'error');
      }
    }
  };

  const handleViewDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowEnrollmentDetailsModal(true);
  };

  const resetEnrollmentForm = () => {
    setEnrollmentFormData({
      user_id: '',
      course_id: '',
      status: 'active',
      completion_percentage: 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Enrollment Management</h1>
            <p className="text-gray-600 mt-2">Manage student enrollments, track progress, and handle course activities</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => setShowEnrollmentModal(true)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Enroll Student
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by student name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{enrollmentStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-2xl font-bold text-green-600">{enrollmentStats.active}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{enrollmentStats.completed}</p>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Paused</p>
                <p className="text-2xl font-bold text-orange-600">{enrollmentStats.paused}</p>
              </div>
              <Pause className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{enrollmentStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Progress</p>
                <p className="text-2xl font-bold text-purple-600">{enrollmentStats.avgProgress}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Enrollment Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading enrollments...</p>
            </div>
          </div>
        ) : filteredEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredEnrollments.map((enrollment) => (
              <EnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                onUpdateProgress={handleUpdateProgress}
                onUpdateStatus={handleUpdateEnrollmentStatus}
                onDelete={handleDeleteEnrollment}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No enrollments found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by enrolling students in courses'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowEnrollmentModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Enroll Your First Student
              </button>
            )}
          </div>
        )}

        {/* Modals */}
        <EnrollmentEditor
          showEnrollmentModal={showEnrollmentModal}
          setShowEnrollmentModal={setShowEnrollmentModal}
          showEnrollmentDetailsModal={showEnrollmentDetailsModal}
          setShowEnrollmentDetailsModal={setShowEnrollmentDetailsModal}
          selectedEnrollment={selectedEnrollment}
          enrollmentFormData={enrollmentFormData}
          setEnrollmentFormData={setEnrollmentFormData}
          users={users}
          courses={courses}
          loading={loading}
          onCreateEnrollment={handleCreateEnrollment}
          onUpdateStatus={handleUpdateEnrollmentStatus}
          resetEnrollmentForm={resetEnrollmentForm}
        />
      </div>
    </div>
  );
};

export default EnrollmentManagement;
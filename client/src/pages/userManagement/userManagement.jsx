import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Eye, UserPlus, Shield, Users, GraduationCap, Search } from 'lucide-react';

const mockStudents = [
  { id: '1', email: 'john.doe@student.edu', full_name: 'John Doe', user_type: 'student', enrollment_date: '2024-09-01', program: 'Computer Science', status: 'active' },
  { id: '3', email: 'jane.smith@student.edu', full_name: 'Jane Smith', user_type: 'student', enrollment_date: '2024-09-01', program: 'Business Administration', status: 'active' },
  { id: '4', email: 'mike.johnson@student.edu', full_name: 'Mike Johnson', user_type: 'student', enrollment_date: '2024-01-15', program: 'Engineering', status: 'suspended' },
];

const mockAdmins = [
  { 
    id: '2', 
    email: 'super@gmail.com', 
    full_name: 'System Administrator', 
    user_type: 'admin',
    role: 'Super Administrator',
    permissions: { all: true },
    status: 'active'
  },
  { 
    id: '5', 
    email: 'academic@gmail.com', 
    full_name: 'Academic Manager', 
    user_type: 'admin',
    role: 'Academic Coordinator',
    permissions: { academic_management: { edit_courses: true, create_courses: true } },
    status: 'active'
  },
];

const permissionCategories = {
  academic_management: {
    label: 'Academic Management',
    permissions: ['create_courses', 'edit_courses', 'delete_courses', 'publish_courses', 'manage_academic_calendar', 'manage_course_content', 'manage_curricula', 'manage_departments']
  },
  user_management: {
    label: 'User Management',
    permissions: ['create_users', 'edit_users', 'delete_users', 'suspend_users', 'view_all_users', 'manage_user_roles']
  },
  enrollment_management: {
    label: 'Enrollment Management',
    permissions: ['create_enrollments', 'edit_enrollments', 'delete_enrollments', 'approve_enrollments', 'manage_enrollment_periods']
  },
  financial_management: {
    label: 'Financial Management',
    permissions: ['manage_tuition_fees', 'process_payments', 'manage_refunds', 'manage_scholarships', 'view_financial_reports']
  },
  grading_and_assessment: {
    label: 'Grading & Assessment',
    permissions: ['view_all_grades', 'edit_all_grades', 'override_grades', 'generate_transcripts', 'manage_assessment_tools']
  },
  communication: {
    label: 'Communication',
    permissions: ['send_system_announcements', 'send_bulk_communications', 'manage_communication_channels', 'moderate_discussions']
  },
  reporting_and_analytics: {
    label: 'Reporting & Analytics',
    permissions: ['view_all_reports', 'view_analytics', 'export_data', 'schedule_reports', 'create_custom_reports']
  },
  system_administration: {
    label: 'System Administration',
    permissions: ['manage_system_backups', 'view_system_logs', 'manage_database', 'manage_api_keys', 'configure_system_settings']
  },
  compliance_and_security: {
    label: 'Compliance & Security',
    permissions: ['manage_access_controls', 'audit_user_activities', 'manage_data_privacy', 'enforce_compliance_policies']
  }
};

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [students, setStudents] = useState(mockStudents);
  const [admins, setAdmins] = useState(mockAdmins);
  const [isDark, setIsDark] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    user_type: 'student',
    role: '',
    program: '',
    permissions: {}
  });

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (user) {
      setFormData({
        email: user.email || '',
        full_name: user.full_name || '',
        user_type: user.user_type || 'student',
        role: user.role || '',
        program: user.program || '',
        permissions: user.permissions || {}
      });
    } else {
      setFormData({
        email: '',
        full_name: '',
        user_type: activeTab === 'students' ? 'student' : 'admin',
        role: '',
        program: '',
        permissions: {}
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      email: '',
      full_name: '',
      user_type: 'student',
      role: '',
      program: '',
      permissions: {}
    });
  };

  const handlePermissionToggle = (category, permission) => {
    setFormData(prev => {
      const newPermissions = { ...prev.permissions };
      if (!newPermissions[category]) {
        newPermissions[category] = {};
      }
      newPermissions[category][permission] = !newPermissions[category][permission];
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => {
      const newPermissions = { ...prev.permissions };
      const allChecked = permissionCategories[category].permissions.every(
        perm => newPermissions[category]?.[perm]
      );
      
      newPermissions[category] = {};
      permissionCategories[category].permissions.forEach(perm => {
        newPermissions[category][perm] = !allChecked;
      });
      
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      ...formData,
      id: selectedUser?.id || String(Date.now()),
      status: selectedUser?.status || 'active'
    };

    if (modalType === 'create') {
      if (formData.user_type === 'student') {
        setStudents([...students, newUser]);
      } else {
        setAdmins([...admins, newUser]);
      }
    } else if (modalType === 'edit') {
      if (formData.user_type === 'student') {
        setStudents(students.map(s => s.id === selectedUser.id ? newUser : s));
      } else {
        setAdmins(admins.map(a => a.id === selectedUser.id ? newUser : a));
      }
    }
    closeModal();
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.full_name}?`)) {
      if (user.user_type === 'student') {
        setStudents(students.filter(s => s.id !== user.id));
      } else {
        setAdmins(admins.filter(a => a.id !== user.id));
      }
    }
  };

  const handleStatusToggle = (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    if (user.user_type === 'student') {
      setStudents(students.map(s => s.id === user.id ? { ...s, status: newStatus } : s));
    } else {
      setAdmins(admins.map(a => a.id === user.id ? { ...a, status: newStatus } : a));
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.program?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAdmins = admins.filter(a => 
    a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentUsers = activeTab === 'students' ? filteredStudents : filteredAdmins;

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-primary p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">User Management</h1>
                <p className="text-secondary">Manage students and administrative users</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="button-secondary px-4 py-2 rounded-lg transition-all duration-200"
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
                <button
                  onClick={() => openModal('create')}
                  className="button-primary px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                >
                  <UserPlus size={20} />
                  <span className="hidden sm:inline">Add User</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-primary rounded-lg p-4 shadow-theme">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary text-sm">Total Students</p>
                    <p className="text-2xl font-bold text-primary">{students.length}</p>
                  </div>
                  <GraduationCap className="text-accent" size={32} />
                </div>
              </div>
              <div className="bg-card border border-primary rounded-lg p-4 shadow-theme">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary text-sm">Total Admins</p>
                    <p className="text-2xl font-bold text-primary">{admins.length}</p>
                  </div>
                  <Shield className="text-accent" size={32} />
                </div>
              </div>
              <div className="bg-card border border-primary rounded-lg p-4 shadow-theme">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary text-sm">Active Users</p>
                    <p className="text-2xl font-bold text-success">
                      {[...students, ...admins].filter(u => u.status === 'active').length}
                    </p>
                  </div>
                  <Users className="text-success" size={32} />
                </div>
              </div>
              <div className="bg-card border border-primary rounded-lg p-4 shadow-theme">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary text-sm">Suspended</p>
                    <p className="text-2xl font-bold text-warning">
                      {[...students, ...admins].filter(u => u.status === 'suspended').length}
                    </p>
                  </div>
                  <Users className="text-warning" size={32} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-primary rounded-lg shadow-theme mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-primary">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'students'
                      ? 'button-primary'
                      : 'button-secondary'
                  }`}
                >
                  <GraduationCap className="inline mr-2" size={18} />
                  Students ({students.length})
                </button>
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'admins'
                      ? 'button-primary'
                      : 'button-secondary'
                  }`}
                >
                  <Shield className="inline mr-2" size={18} />
                  Admins ({admins.length})
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-secondary border border-primary rounded-lg text-primary focus:outline-none focus:border-accent w-full sm:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary border-b border-primary">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary hidden md:table-cell">
                      {activeTab === 'students' ? 'Program' : 'Role'}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-primary hover:bg-secondary transition-colors">
                      <td className="px-4 py-3 text-sm text-primary font-medium">{user.full_name}</td>
                      <td className="px-4 py-3 text-sm text-secondary">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-secondary hidden md:table-cell">
                        {user.program || user.role || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-success' : 'bg-warning'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openModal('view', user)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} className="text-info" />
                          </button>
                          <button
                            onClick={() => openModal('edit', user)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit size={18} className="text-accent" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} className="text-error" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentUsers.length === 0 && (
                <div className="text-center py-12 text-secondary">
                  <Users size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
            <div className="bg-card rounded-lg shadow-theme-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-primary">
                <h2 className="text-xl font-bold text-primary">
                  {modalType === 'create' && 'Add New User'}
                  {modalType === 'edit' && 'Edit User'}
                  {modalType === 'view' && 'User Details'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <X size={20} className="text-secondary" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {modalType === 'view' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-secondary">Full Name</label>
                        <p className="text-primary mt-1">{selectedUser?.full_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-secondary">Email</label>
                        <p className="text-primary mt-1">{selectedUser?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-secondary">User Type</label>
                        <p className="text-primary mt-1 capitalize">{selectedUser?.user_type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-secondary">Status</label>
                        <p className="mt-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedUser?.status === 'active' ? 'bg-success' : 'bg-warning'
                          }`}>
                            {selectedUser?.status}
                          </span>
                        </p>
                      </div>
                      {selectedUser?.program && (
                        <div>
                          <label className="text-sm font-medium text-secondary">Program</label>
                          <p className="text-primary mt-1">{selectedUser.program}</p>
                        </div>
                      )}
                      {selectedUser?.role && (
                        <div>
                          <label className="text-sm font-medium text-secondary">Role</label>
                          <p className="text-primary mt-1">{selectedUser.role}</p>
                        </div>
                      )}
                    </div>

                    {selectedUser?.user_type === 'admin' && selectedUser?.permissions && (
                      <div>
                        <h3 className="font-semibold text-primary mb-3">Permissions</h3>
                        <div className="space-y-3">
                          {Object.keys(selectedUser.permissions).map(category => (
                            <div key={category} className="bg-secondary rounded-lg p-3">
                              <p className="font-medium text-primary mb-2 capitalize">
                                {category.replace(/_/g, ' ')}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {typeof selectedUser.permissions[category] === 'object' ? (
                                  Object.entries(selectedUser.permissions[category])
                                    .filter(([, value]) => value)
                                    .map(([perm]) => (
                                      <span key={perm} className="px-2 py-1 bg-success rounded text-xs">
                                        {perm.replace(/_/g, ' ')}
                                      </span>
                                    ))
                                ) : (
                                  <span className="px-2 py-1 bg-success rounded text-xs">All Permissions</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleStatusToggle(selectedUser)}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                          selectedUser?.status === 'active' ? 'button-destructive' : 'bg-success text-white hover:opacity-90'
                        }`}
                      >
                        {selectedUser?.status === 'active' ? 'Suspend User' : 'Activate User'}
                      </button>
                      <button
                        onClick={() => setModalType('edit')}
                        className="flex-1 button-primary py-2 rounded-lg font-medium"
                      >
                        Edit User
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full px-4 py-2 bg-secondary border border-primary rounded-lg text-primary focus:outline-none focus:border-accent"
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 bg-secondary border border-primary rounded-lg text-primary focus:outline-none focus:border-accent"
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">User Type *</label>
                        <select
                          value={formData.user_type}
                          onChange={(e) => setFormData({ ...formData, user_type: e.target.value, permissions: {} })}
                          className="w-full px-4 py-2 bg-secondary border border-primary rounded-lg text-primary focus:outline-none focus:border-accent"
                        >
                          <option value="student">Student</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      {formData.user_type === 'student' ? (
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">Program</label>
                          <input
                            type="text"
                            value={formData.program}
                            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                            className="w-full px-4 py-2 bg-secondary border border-primary rounded-lg text-primary focus:outline-none focus:border-accent"
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">Role *</label>
                          <input
                            type="text"
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 bg-secondary border border-primary rounded-lg text-primary focus:outline-none focus:border-accent"
                            placeholder="e.g., Academic Coordinator"
                          />
                        </div>
                      )}
                    </div>

                    {formData.user_type === 'admin' && (
                      <div>
                        <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                          <Shield size={20} />
                          Assign Permissions
                        </h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                          {Object.entries(permissionCategories).map(([categoryKey, category]) => (
                            <div key={categoryKey} className="bg-secondary rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <label className="font-medium text-primary">
                                  {category.label}
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleCategoryToggle(categoryKey)}
                                  className="text-xs button-outline px-3 py-1 rounded"
                                >
                                  Toggle All
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {category.permissions.map(permission => (
                                  <label key={permission} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.permissions[categoryKey]?.[permission] || false}
                                      onChange={() => handlePermissionToggle(categoryKey, permission)}
                                      className="w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-secondary">{permission.replace(/_/g, ' ')}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 button-secondary py-2 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 button-primary py-2 rounded-lg font-medium"
                      >
                        {modalType === 'create' ? 'Create User' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
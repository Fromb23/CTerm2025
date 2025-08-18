import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import HeaderDashboard from "./HeaderDashboard";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const role = { name: "Super Admin" };
  const permissions = {
    edit_grades: true,
    view_grades: true,
    edit_courses: true,
    manage_roles: true,
    manage_users: true,
    view_courses: true,
    view_reports: true,
    delete_grades: true,
    create_courses: true,
    delete_courses: true,
    manage_content: true,
    edit_enrollments: true,
    view_enrollments: true,
    create_enrollments: true,
    delete_enrollments: true,
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary text-primary">
      {/* Header with toggle */}
      <HeaderDashboard onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar role={role} permissions={permissions} isSidebarOpen={true} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Dark overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar drawer */}
            <div className="relative flex-1 max-w-xs w-full bg-secondary shadow-lg">
              <Sidebar
                role={role}
                permissions={permissions}
                isMobile={true}
                isSidebarOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </div>
  );
};

export default Dashboard;
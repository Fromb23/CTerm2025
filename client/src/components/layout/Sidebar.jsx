import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
	FiHome,
	FiBook,
	FiUsers,
	FiBarChart2,
	FiSettings,
	FiUser,
	FiShield,
	FiEdit,
	FiFileText,
	FiMenu,
	FiChevronLeft,
	FiX,
	FiArrowLeft,
} from "react-icons/fi";
import Button from "../ui/Button";

const Sidebar = ({
	role = { name: "Super Admin" },
	permissions = {},
	isMobile = false,
	isSidebarOpen = false,
	onClose = () => { },
}) => {
	const [collapsed, setCollapsed] = useState(false);

	// ------------------------
	// Link Definitions
	// ------------------------
	const studentLinks = [
		{ name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
		{ name: "My Courses", path: "/courses", icon: <FiBook /> },
		{ name: "Community", path: "/community", icon: <FiUsers /> },
		{ name: "Reports", path: "/reports", icon: <FiBarChart2 /> },
		{ name: "Settings", path: "/settings", icon: <FiSettings /> },
	];

	const adminLinks = [
		permissions.view_grades && { name: "Grades", path: "/admin/grades", icon: <FiFileText /> },
		permissions.edit_courses && { name: "Courses", path: "/dashboard/courses", icon: <FiBook /> },
		permissions.manage_users && { name: "Users", path: "/admin/users", icon: <FiUser /> },
		permissions.manage_roles && { name: "Roles", path: "/admin/roles", icon: <FiShield /> },
		permissions.view_reports && { name: "Reports", path: "/admin/reports", icon: <FiBarChart2 /> },
		permissions.manage_content && { name: "Content", path: "/admin/content", icon: <FiEdit /> },
	].filter(Boolean);

	// ------------------------
	// NavLink Render
	// ------------------------
	const renderLink = (link) => (
		<NavLink
			key={link.name}
			to={link.path}
			onClick={isMobile ? onClose : undefined} // Auto-close on mobile
			className={({ isActive }) =>
				`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all group relative ${isActive ? "bg-accent text-on-accent" : "hover:bg-muted"
				}`
			}
		>
			{link.icon}
			{!collapsed && <span>{link.name}</span>}

			{collapsed && (
				<span className="absolute left-12 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
					{link.name}
				</span>
			)}
		</NavLink>
	);

	// ------------------------
	// Mobile Sidebar
	// ------------------------
	if (isMobile) {
		return (
			<>
				{/* Overlay */}
				{isSidebarOpen && (
					<div
						className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
						onClick={onClose}
					/>
				)}

				{/* Sidebar Drawer */}
				<aside
					className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary text-primary shadow-theme-lg transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
						}`}
				>
					<div className="p-4 flex justify-between items-center">
						<h2 className="text-lg font-bold">Navigation</h2>
						{/* Close button only visible on mobile */}
						<div className="lg:hidden">
							<button
								onClick={onClose}
								className="p-2 rounded hover:bg-muted"
							>
								<FiX />
							</button>
						</div>
					</div>

					<div className="px-2">
						{role.name === "Student" && <nav className="space-y-2">{studentLinks.map(renderLink)}</nav>}
						{role.name === "Super Admin" && <nav className="space-y-2">{adminLinks.map(renderLink)}</nav>}
					</div>
				</aside>
			</>
		);
	}

	// ------------------------
	// Desktop Sidebar
	// ------------------------
	return (
		<aside
			className={`${collapsed ? "w-20" : "w-64"} bg-secondary text-primary min-h-screen shadow-theme-lg transition-all duration-300`}
		>
			<div className="p-4 flex justify-between items-center">
  {/* Title shown only when sidebar is expanded */}
  {!collapsed && <h2 className="text-lg font-bold">Navigation</h2>}

  {/* Collapse/Expand Button */}
  <button
    onClick={() => setCollapsed(!collapsed)}
    className="p-2 rounded hover:bg-muted"
  >
    {collapsed ? <FiMenu size={20} /> : <FiArrowLeft size={20} />}
  </button>
</div>

			<div className="px-2">
				{role.name === "Student" && (
					<div className="mt-6">
						{!collapsed && <h3 className="text-sm font-semibold uppercase mb-2">Student Panel</h3>}
						<nav className="space-y-2">{studentLinks.map(renderLink)}</nav>
					</div>
				)}

				{role.name === "Super Admin" && (
					<div className="mt-6">
						{!collapsed && <h3 className="text-sm font-semibold uppercase mb-2">Admin Panel</h3>}
						<nav className="space-y-2">{adminLinks.map(renderLink)}</nav>
					</div>
				)}
			</div>
		</aside>
	);
};

export default Sidebar;
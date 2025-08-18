import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../ui/Button";
import Table from "../Table";
import CourseFormModal from "../CourseFormModal";

// ------------------------ AdminCourses ------------------------
const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Fetch courses
  useEffect(() => {
    axios
      .get("/api/admin/courses/")
      .then((res) => setCourses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  // Add new course
  const handleCreateCourse = (courseData) => {
    setCourses((prev) => [
      ...prev,
      { id: Date.now(), course_code: `COURSE-${Math.floor(Math.random() * 1000)}`, ...courseData },
    ]);
  };

  // Toggle multi-select
  const toggleSelectCourse = (id) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  // Delete selected courses
  const deleteSelected = () => {
    setCourses((prev) => prev.filter((c) => !selectedCourses.includes(c.id)));
    setSelectedCourses([]);
  };

  if (loading) return <p>Loading...</p>;

  // Define table columns
  const columns = [
    {
      header: "Select",
      accessorKey: "id",
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedCourses.includes(row.original.id)}
          onChange={() => toggleSelectCourse(row.original.id)}
        />
      ),
    },
    { header: "Course Code", accessorKey: "course_code" },
    { header: "Name", accessorKey: "name" },
    { header: "Duration", accessorKey: "estimated_duration" },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="primary" size="sm">
            View
          </Button>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() =>
              setCourses((prev) => prev.filter((c) => c.id !== row.original.id))
            }
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button onClick={() => setShowForm(true)}>+ Create Course</Button>
      </div>

      {/* Table */}
      {courses.length ? (
        <Table columns={columns} data={courses} />
      ) : (
        <div className="flex flex-col items-center gap-3 mt-12 text-muted">
          <p>No courses available.</p>
        </div>
      )}

      {/* Bulk actions */}
      {selectedCourses.length > 0 && (
        <div className="mt-4 flex gap-2">
          <Button variant="destructive" onClick={deleteSelected}>
            Delete Selected
          </Button>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <CourseFormModal onClose={() => setShowForm(false)} onSubmit={handleCreateCourse} />
      )}
    </div>
  );
};

export default AdminCourses;
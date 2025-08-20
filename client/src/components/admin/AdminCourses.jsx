import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import Table from "../Table";
import Modal from "../ui/Modal";
import CourseFormModal from "../CourseFormModal";
import { createCourse, listCourses } from "../../redux/actions/courseActions";
import { useToast } from "../../contexts/toastContext";
import Loading from "../ui/Loading";
import CourseSprints from "./CourseSprints";

// ------------------------ AdminCourses ------------------------
const AdminCourses = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { addToast } = useToast();

  useEffect(() => {
    dispatch(listCourses());
  }, [dispatch]);
  const { courses, loading, error } = useSelector((state) => state.courses);

  const handleCreateCourse = async (courseData) => {
    const resultAction = await dispatch(createCourse(courseData));

    if (createCourse.fulfilled.match(resultAction)) {
      addToast("Course created successfully!", "success");
    } else {
      addToast(resultAction.payload?.error || "Failed to create course", "error");
    }

    setShowForm(false);
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

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  if (loading) return <Loading message="Loading courses..." />;
  if (error) {
    addToast(error.message || "Failed to load courses", "error");
  }

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
    { header: "Start Date", accessorKey: "start_date" },
    {
      header: "Duration",
      accessorKey: "duration",
      cell: ({ getValue }) => `${getValue()} wks`,
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleViewCourse(row.original)}
          >
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button onClick={() => setShowForm(true)}>+ Create Course</Button>
      </div>

      {courses.length ? (
        <Table columns={columns} data={courses} />
      ) : (
        <div className="flex flex-col items-center gap-3 mt-12 text-muted">
          <p>No courses available.</p>
        </div>
      )}

      {selectedCourses.length > 0 && (
        <div className="mt-4 flex gap-2">
          <Button variant="destructive" onClick={deleteSelected}>
            Delete Selected
          </Button>
        </div>
      )}

      {showForm && (
        <CourseFormModal onClose={() => setShowForm(false)} onSubmit={handleCreateCourse} />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCourse?.name}
      >
        <p>Description: {selectedCourse?.description}</p>
        <p>Duration: {selectedCourse?.duration} wks</p>
        {selectedCourse && (
          <CourseSprints courseId={selectedCourse.id} />
        )}
      </Modal>
    </div>
  );
};

export default AdminCourses;
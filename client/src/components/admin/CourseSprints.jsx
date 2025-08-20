import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import Form from "../ui/Form";
import Table from "../Table";
import { useToast } from "../../contexts/toastContext";
import Loading from "../ui/Loading";
import { createSprint, getSprintsByCourse } from "../../redux/actions/sprintActions";

const CourseSprints = ({ courseId }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const { sprints, loading: fetchLoading, error: fetchError } = useSelector(
    (state) => state.sprints
  );

  // Fetch sprints when courseId changes
  useEffect(() => {
    if (courseId) {
      dispatch(getSprintsByCourse(courseId));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (fetchError) addToast(fetchError, "error");
  }, [fetchError, addToast]);

  const handleCreateSprint = async (formData) => {
    const resultAction = await dispatch(
      createSprint({ courseId, sprintData: formData })
    );

    if (createSprint.fulfilled.match(resultAction)) {
      addToast("Sprint created successfully!", "success");
    } else {
      addToast(resultAction.payload?.error || "Failed to create sprint", "error");
    }

    setShowForm(false);
  };

  const fields = [
    { name: "name", label: "Sprint Name", type: "text", required: true },
    { name: "duration", label: "Duration (weeks)", type: "number", required: true },
    { name: "start_date", label: "Start Date", type: "date", required: true },
    { name: "description", label: "Description", type: "text", required: false },
  ];

  const columns = [
    {
      header: "Sprint Name",
      accessorKey: "name",
    },
    {
      header: "Duration (weeks)",
      accessorKey: "duration",
    },
    {
      header: "Start Date",
      accessorKey: "start_date",
      cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString(),
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => console.log("View sprint", row.original.id)}>
            View
          </Button>
          <Button variant="secondary" onClick={() => console.log("Edit sprint", row.original.id)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => console.log("Delete sprint", row.original.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (fetchLoading) return <Loading message="Loading sprints..." />;

  return (
    <div className="flex flex-col gap-3 max-h-[80vh] overflow-y-auto p-4">
      <h2 className="font-bold text-lg">Sprints</h2>

      {sprints.length === 0 ? (
        <p>No sprints for this course yet.</p>
      ) : (
        <Table columns={columns} data={sprints} />
      )}

      {showForm ? (
        <Form fields={fields} onSubmit={handleCreateSprint}>
          <div className="flex gap-2">
            <Button type="submit">Create Sprint</Button>
            <Button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <Button onClick={() => setShowForm(true)}>+ Add Sprint</Button>
      )}
    </div>
  );
};

export default CourseSprints;
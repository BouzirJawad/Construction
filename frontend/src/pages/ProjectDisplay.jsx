import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BackIcon } from "../icons/BackIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { ModifyIcon } from "../icons/ModifyIcon";
import { AddIcon } from "../icons/AddIcon";
import ProjectCard from "../components/ProjectCard";
import TaskListCard from "../components/TaskListCard";
import { addTask } from "../schemas/addtask";
import { addProject } from "../schemas/addproject";

function ProjectDisplay() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [viewInfo, setviewInfo] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const taskFormik = useFormik({
    initialValues: {
      description: "",
      startDate: "",
      endDate: "",
    },
    validationSchema: addTask,

    onSubmit: async (values, actions) => {
      await createTask(values, () => {
        actions.resetForm();
      });
    },
  });

  const updateProjectFormik = useFormik({
    initialValues: {
      updatedName: "",
      updatedDescription: "",
      updatedStartDate: "",
      updatedEndDate: "",
      updatedBudget: "",
    },
    validationSchema: addProject,
  });

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:7460/api/projects/${projectId}`
        );
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
        toast.error("Error fetching project details", { duration: 4000 });
        navigate("/");
      }
    };

    fetchProjectDetails();
  }, [projectId, navigate]);

  const createTask = async (values, resetForm) => {
    try {
      const res = await axios.post("http://localhost:7460/api/tasks", {
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        projectId: projectId,
      });

      const newTask = res.data;

      setProject((prevProject) => ({
        ...prevProject,
        tasks: [...prevProject.tasks, newTask],
      }));

      toast.success("Task Created Successfully!", { duration: 4000 });
      setTimeout(() => {
        resetForm();
        setIsAdding(false);
      }, 700);
    } catch (err) {
      toast.error("Failed to create Task! please try again.");
      console.error("Error to create task", err);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:7460/api/projects/${projectId}`
      );

      if (response.status === 200) {
        toast.success("Project deleted successfully!", { duration: 4000 });
        navigate("/");
      } else {
        toast.error("Failed to delete projct", { duration: 4000 });
        console.error("Failed to delete projct");
      }
    } catch (error) {
      toast.error("Error Deleting Project", { duration: 4000 });
      console.error("Error Deleting Project", error);
    }
  };


  const updateProject = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:7460/api/projects/${projectId}`,
        {
          name: updateProjectFormik.values.updatedName,
          description: updateProjectFormik.values.updatedDescription,
          startDate: updateProjectFormik.values.updatedStartDate,
          endDate: updateProjectFormik.values.updatedEndDate,
          budget: updateProjectFormik.values.updatedBudget,
        }
      );

      toast.success("Project Updated Successfully!", { duration: 4000 });
      setProject(response.data);

      setTimeout(() => {
        updateProjectFormik.resetForm();
        setIsEditing(false);
      }, 700);
    } catch (error) {
      toast.error("Error Updating Project", { duration: 4000 });
      console.error("Error Deleting Project", error);
    }
  };

  if (!project) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="relative">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate("/")} className="text-2xl">
              <BackIcon />
            </button>
            <p className="text-2xl text-blue-800">{project.name}</p>
          </div>

          <div className="flex">
            <button className="text-2xl" onClick={() => setIsEditing(true)}>
              <ModifyIcon />
            </button>
            <button
              className="text-2xl"
              onClick={() => deleteProject(projectId)}
            >
              <DeleteIcon />
            </button>
          </div>
        </div>

        <div className="flex">
          <div
            onClick={() => setviewInfo(true)}
            className={
              viewInfo
                ? "border-b-2 w-1/2 text-center cursor-pointer py-1"
                : "w-1/2 text-center cursor-pointer py-1 hover:scale-115 transition duration-300"
            }
          >
            <p className="font-bold">Info</p>
          </div>
          <div
            onClick={() => setviewInfo(false)}
            className={
              viewInfo
                ? "w-1/2 text-center cursor-pointer py-1 hover:scale-115 transition duration-300"
                : "border-b-2 w-1/2 text-center cursor-pointer py-1"
            }
          >
            <p className="font-bold">Tasks</p>
          </div>
        </div>

        {viewInfo ? (
          <ProjectCard
            description={project.description}
            startDate={project.startDate}
            endDate={project.endDate}
            budget={project.budget}
          />
        ) : (
          <div>
            {project.tasks.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 m-5">
                <button
                  onClick={() => setIsAdding(true)}
                  className="mx-auto w-50 h-fit max-w-xl text-center place-content-around flex items-center gap-2 primary-btn my-5"
                >
                  <AddIcon />
                  <p className="text-center ">Add a Task</p>
                </button>

                {project.tasks.map((task) => (
                  <TaskListCard
                    key={task._id}
                    id={task._id}
                    description={task.description}
                    startDate={task.startDate}
                    endDate={task.endDate}
                  />
                ))}
              </div>
            ) : (
              <>
                <p className="text-center mt-5">No Tasks found.</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="mx-auto w-50 h-fit text-center place-content-around flex items-center gap-2 primary-btn my-5"
                >
                  <AddIcon />
                  <p className="text-center ">Add a Task</p>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <form
            onSubmit={taskFormik.handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%]"
          >
            <h2 className="text-lg text-center font-bold mb-4">Add Task</h2>

            <label className="block text-gray-600">Description:</label>
            <textarea
              name="description"
              value={taskFormik.values.description}
              onChange={taskFormik.handleChange}
              onBlur={taskFormik.handleBlur}
              className={
                taskFormik.errors.description && taskFormik.touched.description
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded"
              }
            />
            {taskFormik.errors.description &&
              taskFormik.touched.description && (
                <p className="text-xs mb-1 text-red-500">
                  {taskFormik.errors.description}
                </p>
              )}

            <div className="flex gap-7">
              <div className="w-1/2">
                <label className="block text-gray-600">Start Date:</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  onChange={taskFormik.handleChange}
                  value={taskFormik.values.startDate}
                  onBlur={taskFormik.handleBlur}
                  className={
                    taskFormik.errors.startDate && taskFormik.touched.startDate
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded"
                  }
                />
                {taskFormik.errors.startDate &&
                  taskFormik.touched.startDate && (
                    <p className="text-xs mb-1 text-red-500">
                      {taskFormik.errors.startDate}
                    </p>
                  )}
              </div>

              <div className="w-1/2">
                <label className="block text-gray-600">End Date:</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  onChange={taskFormik.handleChange}
                  onBlur={taskFormik.handleBlur}
                  value={taskFormik.values.endDate}
                  className={
                    taskFormik.errors.endDate && taskFormik.touched.endDate
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded"
                  }
                />
                {taskFormik.errors.endDate && taskFormik.touched.endDate && (
                  <p className="text-xs mb-1 text-red-500">
                    {taskFormik.errors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-around gap-2 mt-2">
              <button
                onClick={() => setIsAdding(false)}
                className=" w-[50%] px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                disabled={taskFormik.isSubmitting}
                type="submit"
                className="w-[50%] px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%]"
          >
            <h2 className="text-lg text-center font-bold mb-4">
              Modify Project
            </h2>
            <label className="block text-gray-600">Project Name:</label>
            <input
              type="text"
              name="updatedName"
              value={updateProjectFormik.values.updatedName}
              onChange={updateProjectFormik.handleChange}
              onBlur={updateProjectFormik.handleBlur}
              className={
                updateProjectFormik.errors.updatedName &&
                updateProjectFormik.touched.updatedName
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded bg-white"
              }
            />
            {updateProjectFormik.errors.updatedName &&
              updateProjectFormik.touched.updatedName && (
                <p className="text-xs mb-1 text-red-500">
                  {updateProjectFormik.errors.updatedName}
                </p>
              )}
            <div className="w-full flex gap-7">
              <div className="w-1/2">
                <label className="block text-gray-600">Start Date:</label>
                <input
                  type="datetime-local"
                  name="updatedStartDate"
                  value={updateProjectFormik.values.updatedStartDate}
                  onChange={updateProjectFormik.handleChange}
                  onBlur={updateProjectFormik.handleBlur}
                  className={
                    updateProjectFormik.errors.updatedStartDate &&
                    updateProjectFormik.touched.updatedStartDate
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded"
                  }
                />
                {updateProjectFormik.errors.updatedStartDate &&
                  updateProjectFormik.touched.updatedStartDate && (
                    <p className="text-xs mb-1 text-red-500">
                      {updateProjectFormik.errors.updatedStartDate}
                    </p>
                  )}
              </div>

              <div className="w-1/2">
                <label className="block text-gray-600">End Date:</label>
                <input
                  type="datetime-local"
                  name="updatedEndDate"
                  onChange={updateProjectFormik.handleChange}
                  onBlur={updateProjectFormik.handleBlur}
                  value={updateProjectFormik.values.updatedEndDate}
                  className={
                    updateProjectFormik.errors.updatedEndDate &&
                    updateProjectFormik.touched.updatedEndDate
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded"
                  }
                />
                {updateProjectFormik.errors.updatedEndDate &&
                  updateProjectFormik.touched.updatedEndDate && (
                    <p className="text-xs mb-1 text-red-500">
                      {updateProjectFormik.errors.updatedEndDate}
                    </p>
                  )}
              </div>
            </div>
            <label className="block text-gray-600">Description:</label>
            <textarea
              name="updatedDescription"
              value={updateProjectFormik.values.updatedDescription}
              onChange={updateProjectFormik.handleChange}
              onBlur={updateProjectFormik.handleBlur}
              className={
                updateProjectFormik.errors.updatedDescription &&
                updateProjectFormik.touched.updatedDescription
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded"
              }
            />
            {updateProjectFormik.errors.updatedDescription &&
              updateProjectFormik.touched.updatedDescription && (
                <p className="text-xs mb-1 text-red-500">
                  {updateProjectFormik.errors.updatedDescription}
                </p>
              )}

            <label className="block text-gray-600">Budget:</label>
            <input
              type="text"
              name="updatedBudget"
              value={updateProjectFormik.values.updatedBudget}
              onChange={updateProjectFormik.handleChange}
              onBlur={updateProjectFormik.handleBlur}
              className={
                updateProjectFormik.errors.updatedBudget &&
                updateProjectFormik.touched.updatedBudget
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded"
              }
            />
            {updateProjectFormik.errors.updatedBudget &&
              updateProjectFormik.touched.updatedBudget && (
                <p className="text-xs mb-1 text-red-500">
                  {updateProjectFormik.errors.updatedBudget}
                </p>
              )}

            <div className="flex justify-around gap-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className=" w-[50%] px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                disabled={updateProjectFormik.isSubmitting}
                onClick={()=> updateProject()}
                className="w-[50%] px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDisplay;

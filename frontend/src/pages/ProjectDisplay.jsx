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
import { addtask } from "../schemas/addtask";

function ProjectDisplay() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [viewInfo, setviewInfo] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const onSubmit = async (values, actions) => {
    await createTask(values, () => {
      actions.resetForm();
    });
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      description: "",
      startDate: "",
      endDate: "",
    },
    validationSchema: addtask,
    onSubmit,
  });

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:7460/api/projects/${projectId}`
        );
        console.log("Fetched data:", response.data);
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

      const newTask = res.data

      setProject((prevProject) => ({
        ...prevProject,
        tasks: [...prevProject.tasks, newTask],
      }));

      toast.success("Project Created Successfully!", { duration: 2000 });
      setTimeout(() => {
        resetForm();
        setIsAdding(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to create Task! please try again.");
      console.error("Error to create task", err);
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
            <button onClick={() => navigate('/')} className="text-2xl">
              <BackIcon />
            </button>
            <p className="text-2xl">{project.name}</p>
          </div>

          <div className="flex">
            <button className="text-2xl">
              <ModifyIcon />
            </button>
            <button className="text-2xl">
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
                : "w-1/2 text-center cursor-pointer py-1"
            }
          >
            <p className="font-bold">Info</p>
          </div>
          <div
            onClick={() => setviewInfo(false)}
            className={
              viewInfo
                ? "w-1/2 text-center cursor-pointer py-1"
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
                  className="mx-auto h-fit text-center place-content-around flex items-center gap-2 primary-btn my-5"
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
                  className="mx-auto h-fit text-center place-content-around flex items-center gap-2 primary-btn my-5"
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
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%]"
          >
            <h2 className="text-lg text-center font-bold mb-4">Add Task</h2>

            <label className="block text-gray-600">Description:</label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.description && touched.description
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded"
              }
            />
            {errors.description && touched.description && (
              <p className="text-xs mb-1 text-red-500">{errors.description}</p>
            )}

            <div className="flex gap-7">
              <div>
                <label className="block text-gray-600">Start Date:</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  onChange={handleChange}
                  value={values.startDate}
                  onBlur={handleBlur}
                  className={
                    errors.startDate && touched.startDate
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded"
                  }
                />
                {errors.startDate && touched.startDate && (
                  <p className="text-xs mb-1 text-red-500">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-600">End Date:</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.endDate}
                  className={
                    errors.endDate && touched.endDate
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded"
                  }
                />
                {errors.endDate && touched.endDate && (
                  <p className="text-xs mb-1 text-red-500">{errors.endDate}</p>
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
                disabled={isSubmitting}
                type="submit"
                className="w-[50%] px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProjectDisplay;

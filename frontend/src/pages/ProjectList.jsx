import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import ProjectListCard from "../components/ProjectListCard";
import { AddProjectIcon } from "../icons/AddProjectIcon";
import { addProject } from "../schemas/addproject";
import toast, { Toaster } from "react-hot-toast";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const onSubmit = async (values, actions) => {
    await createProject(values, () => {
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
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: "",
    },
    validationSchema: addProject,
    onSubmit,
  });

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:7460/api/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const createProject = async (values, resetForm) => {
    try {
      await axios.post("http://localhost:7460/api/projects", {
        name: values.name,
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        budget: values.budget,
      });

      toast.success("Project Created Successfully!", { duration: 4000 });
      fetchProjects();
      setTimeout(() => {
        resetForm();
        setIsAdding(false);
      }, 700);
    } catch (err) {
      toast.error("Failed to create project! please try again.");
      console.error("Error to create project", err);
    }
  };

  return (
    <div className="relative">
      <Toaster position="top-center" />
      <section className="w-[95%] min-h-screen bg-gray-100/ mx-auto shadow-xl rounded-2xl m-5">
        <div className="flex items-center justify-center">
          <p className="w-1/2 text-blue-700 text-4xl text-center font-bold py-5">
            Projects
          </p>
          {projects.length >= 6 && (
            <button
              onClick={() => setIsAdding(true)}
              className="mx-auto h-fit text-center place-content-around flex items-center gap-2 primary-btn"
            >
              <AddProjectIcon />
              <p className="text-center ">Add a project</p>
            </button>
          )}
        </div>

        {projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 m-5">
            {projects.map((project) => (
              <ProjectListCard
                key={project._id}
                id={project._id}
                name={project.name}
                description={project.description}
                startDate={project.startDate}
                endDate={project.endDate}
                budget={project.budget}
              />
            ))}
            {projects.length < 6 && (
              <button
                onClick={() => setIsAdding(true)}
                className="w-[90%] mx-auto h-fit text-center place-content-around flex items-center gap-2 primary-btn"
              >
                <AddProjectIcon />
                <p className="text-center ">Add a project</p>
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-center">No Products found.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="w-[30%] mx-auto h-fit text-center place-content-around flex items-center gap-2 primary-btn my-5"
            >
              <AddProjectIcon />
              <p className="text-center ">Add a project</p>
            </button>
          </>
        )}
      </section>

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%]"
          >
            <h2 className="text-lg text-center font-bold mb-4">Add Project</h2>
            <label className="block text-gray-600">Project Name:</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.name && touched.name
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded bg-white"
              }
            />
            {errors.name && touched.name && (
              <p className="text-xs mb-1 text-red-500">{errors.name}</p>
            )}
            <div className="w-full flex gap-7">
              <div className="w-1/2">
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

              <div className="w-1/2">
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

            <label className="block text-gray-600">Budget:</label>
            <input
              type="text"
              name="budget"
              value={values.budget}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.budget && touched.budget
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded"
              }
            />
            {errors.budget && touched.budget && (
              <p className="text-xs mb-1 text-red-500">{errors.budget}</p>
            )}

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

export default ProjectList;

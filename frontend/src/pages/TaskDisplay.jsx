import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BackIcon } from "../icons/BackIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { ModifyIcon } from "../icons/ModifyIcon";
import { AddIcon } from "../icons/AddIcon";
import { addResource } from "../schemas/addresource";
import TaskCard from "../components/TaskCard";

function TaskDisplay() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const onSubmit = async (values, actions) => {
    await createResource(values, () => {
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
      title: "",
      type: "",
      quantity: "",
      description: "",
      supplier: "",
    },
    validationSchema: addResource,
    onSubmit,
  });

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:7460/api/tasks/${taskId}`
        );
        console.log("Fetched data (task):", response.data);
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task details:", error);
        toast.error("Error fetching task details", { duration: 4000 });
        navigate("/");
      }
    };

    fetchTaskDetails();
  }, [taskId, navigate]);

  const createResource = async (values, resetForm) => {
    try {
      const res = await axios.post("http://localhost:7460/api/resources", {
        title: values.title,
        type: values.type,
        quantity: values.quantity,
        description: values.description,
        supplier: values.supplier,
        taskId: taskId,
      });

      const newResource = res.data;

      setTask((prevTask) => ({
        ...prevTask,
        resources: [...prevTask.resources, newResource],
      }));

      toast.success("Resource Created Successfully!", { duration: 4000 });
      setTimeout(() => {
        resetForm();
        setIsAdding(false);
      }, 1000);
    } catch (err) {
      toast.error("Failed to create Resource! please try again.");
      console.error("Error to create resource", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:7460/api/tasks/${taskId}`)

      if (response.status === 200) {
        toast.success("Task deleted successfully!", {duration:4000})
        navigate(`/projects/${task.projectId}`)
      } else {
        toast.error("Failed to delete task", {duration:4000});
        console.error("Failed to delete task");
      }
    } catch (error) {
      toast.error("Error Deleting Task", {duration:4000})
      console.error("Error Deleting Task", error);
    }
  };

  const deleteResource = async (resourceId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:7460/api/resources/${resourceId}`)

      if (response.status === 200) {
        toast.success("Resource deleted successfully!", {duration:4000})

        const response = await axios.get(`http://127.0.0.1:7460/api/tasks/${taskId}`)
        setTask(response.data);

      } else {
        toast.error("Failed to delete resource", {duration:4000});
        console.error("Failed to delete resource");
      }
    } catch (error) {
      toast.error("Error Deleting Resource", {duration:4000})
      console.error("Error Deleting Resource", error);
    }
  };

  if (!task) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="relative">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate(`/projects/${task.projectId}`)} className="text-2xl">
              <BackIcon />
            </button>
            <p className="text-2xl">Task</p>
          </div>

          <div className="flex">
            <button className="text-2xl">
              <ModifyIcon />
            </button>
            <button className="text-2xl" onClick={()=> deleteTask(taskId)}>
              <DeleteIcon />
            </button>
          </div>
        </div>

        <div className="m-5">
          <TaskCard
            description={task.description}
            startDate={task.startDate}
            endDate={task.endDate}
          />
        </div>

        <div className="flex items-center m-3">
          <p className="text-2xl text-blue-800 underline">Resources:</p>
          <button
            onClick={() => setIsAdding(true)}
            className="ml-auto h-fit text-center place-content-around flex items-center gap-2 primary-btn my-5"
          >
            <AddIcon />
            <p className="text-center ">Add a Resource</p>
          </button>
        </div>

        <div>
          {task.resources.length > 0 ? (
            <table className="w-full border-x  border-gray-300">
              <thead>
                <tr className="bg-blue-200 ">
                  <th className="p-2">Title</th>
                  <th className=" p-2">Type</th>
                  <th className=" p-2">Quantity</th>
                  <th className=" p-2">Description</th>
                  <th className=" p-2">Supplier</th>
                  <th className=" p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {task.resources.map((resource) => (
                    <tr key={resource._id} className="border-b text-center">
                      <td className=" p-2">{resource.title}</td>
                      <td className=" p-2">{resource.type}</td>
                      <td className=" p-2">{resource.quantity}</td>
                      <td className=" p-2">{resource.description}</td>
                      <td className=" p-2">{resource.supplier}</td>
                      <td className="">
                        <div className="flex justify-center">
                          <button className="text-xl">
                            <ModifyIcon />
                          </button>
                          <button className="text-xl" onClick={()=> deleteResource(resource._id)}>
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          ) : (
            <p className="text-center mt-5">No Resources found.</p>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 md:p-10 rounded-lg shadow-lg w-[90%] md:w-[70%]"
          >
            <h2 className="text-lg text-center font-bold mb-4">Add Resource</h2>
            <label className="block text-gray-600">Title:</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.title && touched.title
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded bg-white"
              }
            />
            {errors.title && touched.title && (
              <p className="text-xs mb-1 text-red-500">{errors.title}</p>
            )}

            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block text-gray-600">Type:</label>
                <input
                  type="text"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.type && touched.type
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded bg-white"
                  }
                />
                {errors.type && touched.type && (
                  <p className="text-xs mb-1 text-red-500">{errors.type}</p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-gray-600">Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.quantity && touched.quantity
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded bg-white"
                  }
                />
                {errors.quantity && touched.quantity && (
                  <p className="text-xs mb-1 text-red-500">{errors.quantity}</p>
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

            <label className="block text-gray-600">Supplier:</label>
            <input
              type="text"
              name="supplier"
              value={values.supplier}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.supplier && touched.supplier
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded"
              }
            />
            {errors.supplier && touched.supplier && (
              <p className="text-xs mb-1 text-red-500">{errors.supplier}</p>
            )}

            <div className="flex justify-around gap-7 mt-2">
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
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TaskDisplay;

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
import { addTask } from "../schemas/addtask";

function TaskDisplay() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [isEditingResource, setIsEditingResource] = useState(false);
  const [isEditingResourceId, setIsEditingResourceId] = useState(null);

  const resourceFromik = useFormik({
    initialValues: {
      title: "",
      type: "",
      quantity: "",
      description: "",
      supplier: "",
    },
    validationSchema: addResource,

    onSubmit: async (values, actions) => {
      await createResource(values, () => {
        actions.resetForm();
      });
    },
  });

  const updateTaskFormik = useFormik({
    initialValues: {
      updatedDescription: "",
      updatedStartDate: "",
      updatedEndDate: "",
    },
    validationSchema: addTask,
  });

  const updateResourceFromik = useFormik({
    initialValues: {
      updatedTitle: "",
      updatedType: "",
      updatedQuantity: "",
      updatedDescription: "",
      updatedSupplier: "",
    },
    validationSchema: addResource,
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
      const response = await axios.delete(
        `http://127.0.0.1:7460/api/tasks/${taskId}`
      );

      if (response.status === 200) {
        toast.success("Task deleted successfully!", { duration: 4000 });
        navigate(`/projects/${task.projectId}`);
      } else {
        toast.error("Failed to delete task", { duration: 4000 });
        console.error("Failed to delete task");
      }
    } catch (error) {
      toast.error("Error Deleting Task", { duration: 4000 });
      console.error("Error Deleting Task", error);
    }
  };

  const deleteResource = async (resourceId) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:7460/api/resources/${resourceId}`
      );

      if (response.status === 200) {
        toast.success("Resource deleted successfully!", { duration: 4000 });

        const response = await axios.get(
          `http://127.0.0.1:7460/api/tasks/${taskId}`
        );
        setTask(response.data);
      } else {
        toast.error("Failed to delete resource", { duration: 4000 });
        console.error("Failed to delete resource");
      }
    } catch (error) {
      toast.error("Error Deleting Resource", { duration: 4000 });
      console.error("Error Deleting Resource", error);
    }
  };

  const updateTask = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:7460/api/tasks/${taskId}`,
        {
          description: updateTaskFormik.values.updatedDescription,
          startDate: updateTaskFormik.values.updatedStartDate,
          endDate: updateTaskFormik.values.updatedEndDate,
        }
      );

      toast.success("Task Updated Successfully!", { duration: 4000 });
      setTask(response.data);

      setTimeout(() => {
        updateTaskFormik.resetForm();
        setIsEditingTask(false);
      }, 700);
    } catch (error) {
      toast.error("Error Updating Project", { duration: 4000 });
      console.error("Error Deleting Project", error);
    }
  };

  const updateResource = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:7460/api/resources/${isEditingResourceId}`,
        {
          title: updateResourceFromik.values.updatedTitle,
          type: updateResourceFromik.values.updatedTitle,
          quantity: updateResourceFromik.values.updatedQuantity,
          description: updateResourceFromik.values.updatedDescription,
          supplier: updateResourceFromik.values.updatedSupplier,
        }
      );

      toast.success("Resource Updated Successfully!", { duration: 4000 });
      setTask(response.data);

      setTimeout(() => {
        updateResourceFromik.resetForm();
        setIsEditingResource(false);
      }, 700);
    } catch (error) {
      toast.error("Error Updating Resource", { duration: 4000 });
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
            <button
              onClick={() => navigate(`/projects/${task.projectId}`)}
              className="text-2xl"
            >
              <BackIcon />
            </button>
            <p className="text-2xl">Task</p>
          </div>

          <div className="flex">
            <button className="text-2xl" onClick={() => setIsEditingTask(true)}>
              <ModifyIcon />
            </button>
            <button className="text-2xl" onClick={() => deleteTask(taskId)}>
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
                        <button
                          className="text-xl"
                          onClick={() => {
                            setIsEditingResource(true);
                            setIsEditingResourceId(resource._id)
                          }}
                        >
                          <ModifyIcon />
                        </button>
                        <button
                          className="text-xl"
                          onClick={() => deleteResource(resource._id)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
            onSubmit={resourceFromik.handleSubmit}
            className="bg-white p-4 md:p-10 rounded-lg shadow-lg w-[90%] md:w-[70%]"
          >
            <h2 className="text-lg text-center font-bold mb-4">Add Resource</h2>
            <label className="block text-gray-600">Title:</label>
            <input
              type="text"
              name="title"
              value={resourceFromik.values.title}
              onChange={resourceFromik.handleChange}
              onBlur={resourceFromik.handleBlur}
              className={
                resourceFromik.errors.title && resourceFromik.touched.title
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded bg-white"
              }
            />
            {resourceFromik.errors.title && resourceFromik.touched.title && (
              <p className="text-xs mb-1 text-red-500">
                {resourceFromik.errors.title}
              </p>
            )}

            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block text-gray-600">Type:</label>
                <input
                  type="text"
                  name="type"
                  value={resourceFromik.values.type}
                  onChange={resourceFromik.handleChange}
                  onBlur={resourceFromik.handleBlur}
                  className={
                    resourceFromik.errors.type && resourceFromik.touched.type
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded bg-white"
                  }
                />
                {resourceFromik.errors.type && resourceFromik.touched.type && (
                  <p className="text-xs mb-1 text-red-500">
                    {resourceFromik.errors.type}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-gray-600">Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={resourceFromik.values.quantity}
                  onChange={resourceFromik.handleChange}
                  onBlur={resourceFromik.handleBlur}
                  className={
                    resourceFromik.errors.quantity &&
                    resourceFromik.touched.quantity
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded bg-white"
                  }
                />
                {resourceFromik.errors.quantity &&
                  resourceFromik.touched.quantity && (
                    <p className="text-xs mb-1 text-red-500">
                      {resourceFromik.errors.quantity}
                    </p>
                  )}
              </div>
            </div>

            <label className="block text-gray-600">Description:</label>
            <textarea
              name="description"
              value={resourceFromik.values.description}
              onChange={resourceFromik.handleChange}
              onBlur={resourceFromik.handleBlur}
              className={
                resourceFromik.errors.description &&
                resourceFromik.touched.description
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded"
              }
            />
            {resourceFromik.errors.description &&
              resourceFromik.touched.description && (
                <p className="text-xs mb-1 text-red-500">
                  {resourceFromik.errors.description}
                </p>
              )}

            <label className="block text-gray-600">Supplier:</label>
            <input
              type="text"
              name="supplier"
              value={resourceFromik.values.supplier}
              onChange={resourceFromik.handleChange}
              onBlur={resourceFromik.handleBlur}
              className={
                resourceFromik.errors.supplier &&
                resourceFromik.touched.supplier
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded"
              }
            />
            {resourceFromik.errors.supplier &&
              resourceFromik.touched.supplier && (
                <p className="text-xs mb-1 text-red-500">
                  {resourceFromik.errors.supplier}
                </p>
              )}

            <div className="flex justify-around gap-7 mt-2">
              <button
                onClick={() => setIsAdding(false)}
                className=" w-[50%] px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                disabled={resourceFromik.isSubmitting}
                type="submit"
                className="w-[50%] px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {isEditingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%]">
            <h2 className="text-lg text-center font-bold mb-4">Add Task</h2>

            <label className="block text-gray-600">Description:</label>
            <textarea
              name="updatedDescription"
              value={updateTaskFormik.values.updatedDescription}
              onChange={updateTaskFormik.handleChange}
              onBlur={updateTaskFormik.handleBlur}
              className={
                updateTaskFormik.errors.updatedDescription &&
                updateTaskFormik.touched.updatedDescription
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded"
              }
            />
            {updateTaskFormik.errors.updatedDescription &&
              updateTaskFormik.touched.updatedDescription && (
                <p className="text-xs mb-1 text-red-500">
                  {updateTaskFormik.errors.updatedDescription}
                </p>
              )}

            <div className="flex gap-7">
              <div className="w-1/2">
                <label className="block text-gray-600">Start Date:</label>
                <input
                  type="datetime-local"
                  name="updatedStartDate"
                  onChange={updateTaskFormik.handleChange}
                  value={updateTaskFormik.values.updatedStartDate}
                  onBlur={updateTaskFormik.handleBlur}
                  className={
                    updateTaskFormik.errors.updatedStartDate &&
                    updateTaskFormik.touched.updatedStartDate
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded"
                  }
                />
                {updateTaskFormik.errors.updatedStartDate &&
                  updateTaskFormik.touched.updatedStartDate && (
                    <p className="text-xs mb-1 text-red-500">
                      {updateTaskFormik.errors.updatedStartDate}
                    </p>
                  )}
              </div>

              <div className="w-1/2">
                <label className="block text-gray-600">End Date:</label>
                <input
                  type="datetime-local"
                  name="updatedEndDate"
                  onChange={updateTaskFormik.handleChange}
                  onBlur={updateTaskFormik.handleBlur}
                  value={updateTaskFormik.values.updatedEndDate}
                  className={
                    updateTaskFormik.errors.updatedEndDate &&
                    updateTaskFormik.touched.updatedEndDate
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded"
                  }
                />
                {updateTaskFormik.errors.updatedEndDate &&
                  updateTaskFormik.touched.updatedEndDate && (
                    <p className="text-xs mb-1 text-red-500">
                      {updateTaskFormik.errors.updatedEndDate}
                    </p>
                  )}
              </div>
            </div>

            <div className="flex justify-around gap-2 mt-2">
              <button
                onClick={() => setIsEditingTask(false)}
                disabled={resourceFromik.isSubmitting}
                className=" w-[50%] px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                disabled={resourceFromik.isSubmitting}
                onClick={() => updateTask()}
                className="w-[50%] px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingResource && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <form
            onSubmit={updateResourceFromik.handleSubmit}
            className="bg-white p-4 md:p-10 rounded-lg shadow-lg w-[90%] md:w-[70%]"
          >
            <h2 className="text-lg text-center font-bold mb-4">
              Modify Resource
            </h2>
            <label className="block text-gray-600">Title:</label>
            <input
              type="text"
              name="updatedTitle"
              value={updateResourceFromik.values.updatedTitle}
              onChange={updateResourceFromik.handleChange}
              onBlur={updateResourceFromik.handleBlur}
              className={
                updateResourceFromik.errors.updatedTitle &&
                updateResourceFromik.touched.updatedTitle
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded bg-white"
              }
            />
            {updateResourceFromik.errors.updatedTitle &&
              updateResourceFromik.touched.tiupdatedTitletupdatedTitlele && (
                <p className="text-xs mb-1 text-red-500">
                  {updateResourceFromik.errors.updatedTitle}
                </p>
              )}

            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block text-gray-600">Type:</label>
                <input
                  type="text"
                  name="updatedType"
                  value={updateResourceFromik.values.updatedType}
                  onChange={updateResourceFromik.handleChange}
                  onBlur={updateResourceFromik.handleBlur}
                  className={
                    updateResourceFromik.errors.updatedType &&
                    updateResourceFromik.touched.updatedType
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded bg-white"
                  }
                />
                {updateResourceFromik.errors.updatedType &&
                  updateResourceFromik.touched.updatedType && (
                    <p className="text-xs mb-1 text-red-500">
                      {updateResourceFromik.errors.updatedType}
                    </p>
                  )}
              </div>
              <div className="w-1/2">
                <label className="block text-gray-600">Quantity:</label>
                <input
                  type="number"
                  name="updatedQuantity"
                  value={updateResourceFromik.values.updatedQuantity}
                  onChange={updateResourceFromik.handleChange}
                  onBlur={updateResourceFromik.handleBlur}
                  className={
                    updateResourceFromik.errors.updatedQuantity &&
                    updateResourceFromik.touched.updatedQuantity
                      ? "input-error w-full p-2 border rounded"
                      : "w-full p-2 border rounded bg-white"
                  }
                />
                {updateResourceFromik.errors.updatedQuantity &&
                  updateResourceFromik.touched.updatedQuantity && (
                    <p className="text-xs mb-1 text-red-500">
                      {updateResourceFromik.errors.updatedQuantity}
                    </p>
                  )}
              </div>
            </div>

            <label className="block text-gray-600">Description:</label>
            <textarea
              name="updatedDescription"
              value={updateResourceFromik.values.updatedDescription}
              onChange={updateResourceFromik.handleChange}
              onBlur={updateResourceFromik.handleBlur}
              className={
                updateResourceFromik.errors.updatedDescription &&
                updateResourceFromik.touched.updatedDescription
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded"
              }
            />
            {updateResourceFromik.errors.updatedDescription &&
              updateResourceFromik.touched.updatedDescription && (
                <p className="text-xs mb-1 text-red-500">
                  {updateResourceFromik.errors.updatedDescription}
                </p>
              )}

            <label className="block text-gray-600">Supplier:</label>
            <input
              type="text"
              name="updatedSupplier"
              value={updateResourceFromik.values.updatedSupplier}
              onChange={updateResourceFromik.handleChange}
              onBlur={updateResourceFromik.handleBlur}
              className={
                updateResourceFromik.errors.updatedSupplier &&
                updateResourceFromik.touched.updatedSupplier
                  ? "input-error w-full p-2 border rounded"
                  : "w-full p-2 border rounded"
              }
            />
            {updateResourceFromik.errors.updatedSupplier &&
              updateResourceFromik.touched.updatedSupplier && (
                <p className="text-xs mb-1 text-red-500">
                  {updateResourceFromik.errors.updatedSupplier}
                </p>
              )}

            <div className="flex justify-around gap-7 mt-2">
              <button
                onClick={() => setIsEditingResource(false)}
                className=" w-[50%] px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                disabled={resourceFromik.isSubmitting}
                onClick={() => updateResource()}
                type="submit"
                className="w-[50%] px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Modify
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TaskDisplay;

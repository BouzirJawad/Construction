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

function TaskDisplay() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

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
        console.log("Fetched data:", response.data);
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

      toast.success("Resource Created Successfully!", { duration: 2000 });
      setTimeout(() => {
        resetForm();
        setIsAdding(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to create Resource! please try again.");
      console.error("Error to create resource", err);
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
            <button onClick={() => navigate("/")} className="text-2xl">
              <BackIcon />
            </button>
            <p className="text-2xl">{task.description}</p>
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
      </div>
    </div>
  );
}

export default TaskDisplay;

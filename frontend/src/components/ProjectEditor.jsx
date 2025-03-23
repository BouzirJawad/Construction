import { useState } from "react";

export default function ProjectEditor() {
    const [isEditing, setIsEditing] = useState(false);
    const [project, setProject] = useState({
        name: "Conference in New York",
        description: "A business conference happening in NYC.",
        startDate: "2025-06-15",
        endDate: "2025-06-18"
    });

    const handleChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    return (
        <div className="relative p-6">
            {/* PROJECT DISPLAY */}
            <div className="bg-white h-[1000px] p-6 rounded-lg shadow-lg">
                <h1 className="text-xl font-bold">{project.name}</h1>
                <p className="text-gray-600">{project.description}</p>
                <p className="text-sm text-gray-500">
                    {project.startDate} - {project.endDate}
                </p>
                <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Edit Project
                </button>
            </div>

            {/* EDIT MODAL */}
            
            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[50%]">
                        <h2 className="text-lg font-bold mb-4">Edit Project</h2>
                        <input
                            type="text"
                            name="name"
                            value={project.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <textarea
                            name="description"
                            value={project.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="date"
                            name="startDate"
                            value={project.startDate}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={project.endDate}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-4"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

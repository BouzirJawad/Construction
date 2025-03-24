import React from "react";

function ProjectCard(props) {
  return (
    <div className="mt-5 space-y-4 mx-3">
      <div>
        <p className="text-2xl text-sky-700 underline">Description</p>
        <p className="mx-5 mt-2">{props.description}</p>
      </div>

      <div>
        <p className="text-2xl text-sky-700 underline">Duration</p>
        <div className="flex gap-7 items-center mt-2">
        <p className="mx-5 mt-2">From: {new Date(props.startDate).toLocaleTimeString()}, {new Date(props.startDate).toLocaleDateString()}</p>
        <p className="mx-5 mt-2">To: {new Date(props.endDate).toLocaleTimeString()}, {new Date(props.endDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div>
        <p className="text-2xl text-sky-700 underline">Budget</p>
        <p className="mx-5 mt-2">{props.budget}</p>
      </div>
    </div>
  );
}

export default ProjectCard;

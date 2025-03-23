import React from "react";

function ProjectCard(props) {
  return (
    <div className="mt-5 space-y-4 mx-3">
      <div>
        <p className="text-2xl underline">Description</p>
        <p className="mx-5 mt-2">{props.description}</p>
      </div>

      <div>
        <p className="text-2xl underline">Duration</p>
        <p className="mx-5 mt-2">From: {props.startDate}</p>
        <p className="mx-5">To: {props.startDate}</p>
      </div>

      <div>
        <p className="text-2xl underline">Budget</p>
        <p className="mx-5 mt-2">{props.budget}</p>
      </div>
    </div>
  );
}

export default ProjectCard;

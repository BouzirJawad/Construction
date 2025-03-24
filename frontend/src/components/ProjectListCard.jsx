import React from "react";
import { Link } from "react-router-dom";

function ProjectListCard(props) {
  return (
    <Link
      to={`/projects/${props.id}`}
      className="w-[95%] mb-2 py-3 space-y-3 text-center mx-auto rounded-2xl bg-gray-100 shadow-md cursor-pointer hover:scale-105 transition duration-500"
    >
      <p className="text-xl font-bold text-blue-700">{props.name}</p>
      <div className="mx-auto w-fit flex gap-10">
        <p className="text-sm">
          From {new Date(props.startDate).toLocaleDateString()}
        </p>
        <p className="text-sm">
          To {new Date(props.endDate).toLocaleDateString()}
        </p>
      </div>
      <p>Budget: {props.budget} Dh</p>
    </Link>
  );
}

export default ProjectListCard;

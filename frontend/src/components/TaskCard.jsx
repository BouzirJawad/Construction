import React from 'react'

function TaskCard(props) {
  return (
    <div className="mt-5 space-y-4">
      <div>
        <p className="text-2xl text-blue-800 underline">Description</p>
        <p className="mx-5 mt-2">{props.description}</p>
      </div>

      <div>
        <p className="text-2xl text-blue-800 underline">Duration</p>
        <p className="mx-5 mt-2">From: {new Date(props.startDate).toLocaleTimeString()}, {new Date(props.startDate).toLocaleDateString()}</p>
        <p className="mx-5 mt-2">To: {new Date(props.endDate).toLocaleTimeString()}, {new Date(props.endDate).toLocaleDateString()}</p>
      </div>

    </div>
  )
}

export default TaskCard
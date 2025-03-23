import React from 'react'
import { Link } from 'react-router-dom'

function ProjectListCard(props) {
  return (
    <Link to={`/projects/${props.id}`} className='w-[95%] py-3 space-y-3 text-center mx-auto rounded-2xl bg-gray-100 shadow-md cursor-pointer'>
        <p className='text-xl font-bold text-blue-400'>{props.name}</p>
        <p className='text-sm'>From {props.startDate}</p>
        <p className='text-sm'>To {props.endDate}</p>
        <p>Budget: {props.budget} Dh</p>
    </Link>
  )
}

export default ProjectListCard
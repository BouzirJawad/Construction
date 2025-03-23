import React from 'react'
import { Link } from 'react-router-dom'

function TaskListCard(props) {
  return (
    <Link to={`/tasks/${props.id}`} className='bg-slate-200 rounded-xl p-5 hover:scale-105 duration-500 transition'>
        <p className='font-bold'>{props.description}</p>
        <p className='text-sm'>From {props.startDate}</p>
        <p className='text-sm'>To {props.endDate}</p>
    </Link>
  )
}

export default TaskListCard
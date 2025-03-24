import React from 'react'
import { Link } from 'react-router-dom'

function TaskListCard(props) {
  return (
    <Link to={`/tasks/${props.id}`} className='bg-blue-200 rounded-xl p-5 hover:scale-105 duration-500 transition'>
        <p className='font-bold mb-3'>{props.description}</p>
        <div className='flex gap-5'>
        <p className='text-sm'>From  { new Date(props.startDate).toLocaleDateString()}</p>
        <p className='text-sm'>To {new Date(props.endDate).toLocaleDateString()}</p>          
        </div>
    </Link>
  )
}

export default TaskListCard
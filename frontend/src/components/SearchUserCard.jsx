import React from 'react'
import { Link } from 'react-router-dom'

const SearchUserCard = ({user,onClose}) => {
  return (
      <Link to={"/"+user?._id} onClick={onClose} className='w-full flex flex-col justify-center my-2 p-2 cursor-pointer border-b-slate-200 hover:border hover:border-purple-700 rounded'>
        <h2 className='font-bold'>{user?.name}</h2>
        <p>{user?.email}</p>
      </Link>
  )
}

export default SearchUserCard

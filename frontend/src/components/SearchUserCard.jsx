import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar';

const SearchUserCard = ({user,onClose}) => {
  return (
      <Link to={"/"+user?._id} onClick={onClose} className='w-full flex items-center gap-4 my-2 p-2 cursor-pointer border-b-slate-200 hover:border hover:border-purple-700 rounded'>
        <Avatar userId={user._id} name={user.name} imageUrl={user.profile_pic} width={25} height={25} />
        <h2 > <b> {user?.name} </b> <br /> <p>{user?.email}</p></h2>
      </Link>
  )
}

export default SearchUserCard

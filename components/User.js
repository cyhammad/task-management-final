import React, { useEffect, useState } from 'react'
import {
    TrashIcon,
    EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

function User({profileImage, name, email, phone, lastSeen, status, select}) {
  const [selected, setSelected] = useState(select)
  useEffect(
    ()=>{
      setSelected(select)
    },[select]
  )
  return (
    <>
      {selected? 
        <div className="bg-[#F4F5F8] mx-2 px-2 py-3 h-20 border-b border-gray-300 flex items-center gap-x-5 justify-between cursor-pointer">
          <input type="checkbox" name="selected" id="selected" className="w-4 h-4 checked:bg-[#004064]" onClick={()=>setSelected(false)} checked />
          <div className=" rounded-md bg-white">
              <Image src={profileImage} alt="profile" height={40} width={40} className="h-10 cursor-pointer rounded-full" />
          </div>
          <p className="font-medium w-24">{name.charAt(0).toUpperCase()+ name.slice(1)}</p>
          <p className="text-gray-500 grow text-center w-36 hidden md:flex">{email}</p>
          <p className="text-gray-500 grow text-center hidden md:flex">{phone}</p>
          <p className="bg-[#004064] text-white text-center px-4 py-1 hidden md:flex">{status}</p>
          <p className="text-gray-500 grow text-center hidden md:flex">{lastSeen}</p>
          <TrashIcon className="w-5 h-5 grow" />
          <EllipsisHorizontalIcon className="h-8 w-8" />
        </div>:
        <div className="mx-2 px-2 py-3 h-20 border-b border-gray-300 flex items-center gap-x-5 justify-between cursor-pointer" >
          <input type="checkbox" name="selected" id="selected" className="w-4 h-4 checked:bg-[#004064]" onClick={()=>setSelected(true)} />
          <div className=" rounded-md bg-white flex items-center">
            <Image src={profileImage} alt="profile" height={40} width={40} className="h-10 cursor-pointer rounded-full" />
          </div>
          <p className="font-medium w-24">{name.charAt(0).toUpperCase()+ name.slice(1)}</p>
          <p className="text-gray-500 grow text-center w-36 hidden md:flex">{email}</p>
          <p className="text-gray-500 grow text-center hidden md:flex">{phone}</p>
          <p className="bg-[#D5FFCE] text-amber-700 text-center px-4 py-1 hidden md:flex">{status}</p>
          <p className="text-gray-500 grow text-center hidden md:flex">{lastSeen}</p>
          <TrashIcon className="w-5 h-5 grow" />
          <EllipsisHorizontalIcon className="h-8 w-8" />
        </div>
      }
    </>
  )
}

export default User

import Image from 'next/image'
import React, { useState } from 'react'

function Chat({senderImage, sender, messageTime}) {
    const [open, setOpen] = useState(false)
    return (
      <div>
        <div className={open == true ? "bg-[#F3F3F3] px-4 py-4 flex space-x-3 min-w-[240px]":"bg-white px-4 py-4 flex space-x-3 min-w-[240px]"} onClick={()=>setOpen(true)} >
          <div className=" rounded-md bg-white">
            <Image src={senderImage} alt="profile" height={50} width={50} className="h-10 cursor-pointer rounded-full" />
          </div>
          <div className="flex justify-between w-full">
              <div>   
                  <p className='text-sm font-medium'>{sender}</p>
                  <div className="flex space-x-2 pt-1">
                      <span className="text-[10px] text-gray-500">Lorem ipsum dolor sit amet.</span>
                  </div>
              </div>
              <p className="text-[10px] font-medium">{messageTime}</p>
          </div>
        </div>
      </div>
    )
}

export default Chat
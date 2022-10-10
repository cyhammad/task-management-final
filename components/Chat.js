import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';

function Chat({chatDetails, onClick}) {
    const [sender, setSender] = useState(null);
    useEffect(
      () =>{
        const userDoc = getDoc(doc(db, 'users', chatDetails.with)).then(
          (docSnap)=>{
            console.log(docSnap.data())
            setSender(docSnap.data())
          }
        )
      },
      [chatDetails]
    );
    const printDate = () => chatDetails.timeSent.toDate().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

    console.log("Chat : ", chatDetails)
    return (
      <div onClick={onClick}>
        <div className="bg-white px-4 py-4 flex space-x-3 min-w-[240px] hover:bg-[#F3F3F3] cursor-pointer" >
          <div className=" rounded-md bg-white">
            <Image src={sender != null ? sender.profilePic : ""} alt="profile" height={50} width={50} className="h-10 cursor-pointer rounded-full" />
          </div>
          <div className="flex justify-between w-full">
              <div>   
                  <p className='text-sm font-medium'>{sender != null ? sender.name : ""}</p>
                  <div className="flex space-x-2 pt-1">
                      <span className="text-[10px] text-gray-500">{chatDetails.recentMessage == null ? "No Recent Message": chatDetails.recentMessage.length > 27 ? chatDetails.recentMessage.substring(0,25)+"..." : chatDetails.recentMessage }</span>
                  </div>
              </div>
              <p className="text-[10px] font-medium min-w-fit">{chatDetails.timeSent == null ? "": printDate()}</p>
          </div>
        </div>
      </div>
    )
}

export default Chat
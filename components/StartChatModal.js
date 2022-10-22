import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';

function StartChatModal({openChat}) {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "users"), where("uid", "!=", auth.currentUser.uid)),
        (snapshot) => {
          setUsers(snapshot.docs);
        }
      ),
    [db]
  );
  const createNewChat = async (user) => {
    const docSnap = getDoc(doc(db, `users/${auth.currentUser.uid}/chats`, user.data().uid+'-chat')).then(
      async (docSnapshot)=>{
        if (!docSnapshot.exists()){
          const docRef = await setDoc(doc(db, `users/${auth.currentUser.uid}/chats`, user.data().uid+'-chat'),{
            with: user.data().uid,
            isSeen: true,
            recentMessage: null,
            timeSent: null
          }).then(
            openChat(user.data().uid+'-chat')
          )
          console.log("CHAT ADDED WITH DOCREF: ", docRef); 
        }
        else {
          console.log("Chat already exists")
          openChat(user.data().uid+'-chat')
        }
      }
    )
    setShowModal(false);

  }
  return (
    <>
      <div className='text-center pb-2 cursor-pointer hover:font-semibold' onClick={()=>setShowModal(!showModal)}>
        Start a new chat
      </div>
      {showModal ? (
          <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-4xl lg:min-w-[600px]">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between border-b border-solid">
                  <div className="flex items-start justify-between py-6 pl-10 border-b border-solid border-slate-200 rounded-t grow">
                    <h3 className="text-xl font-semibold pt-1">Start Chat</h3>
                  </div>
                  <button
                    className="w-4 h-4 bg-slate-700 flex justify-center items-center text-white rounded-full text-[9px] m-2"
                    onClick={() => setShowModal(false)}
                  >
                    x
                  </button>
                </div>
                {/*body*/}
                {users.map(user=>(
                  <div className='flex items-center space-x-4 mx-10 my-5 hover:font-semibold cursor-pointer' onClick={()=>createNewChat(user)} key={user.data().uid} >
                    <Image src={user.data().profilePic} alt="profile" height={40} width={40} className="h-10 rounded-full" />
                    <div className=''>{user.data().name}</div>
                  </div>
                ))}

                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
        ):(
          <></>
        )
      }
    </>
  )
}

export default StartChatModal
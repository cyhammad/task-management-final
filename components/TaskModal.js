import React, { useEffect, useState } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function TaskModal({ task }) {
  const [showModal, setShowModal] = useState(false);
  const [userPic, setUserPic] = useState("");
  const [remainingTime, setRemainingTime] = useState(null);
  useEffect(() => {
    if (task.userId != undefined) {
      const docRef = doc(db, "users", task.userId);
      getDoc(docRef).then((docSnap) => {
        setUserPic(docSnap.data().profilePic);
      });
    }
  }, [task]);
  useEffect(()=>{
    const date = new Date();
    const dueDate = new Date(task.dueDateTime)
    const diff = new Date(date.getTime() - dueDate.getTime())
    setRemainingTime(diff.getUTCDay() +"D "+diff.getUTCHours()+" Hrs "+diff.getUTCMinutes()+" mins");
  },[task])
  const handleMarkComplete = async() => {
    const docRef = doc(db, `users/${task.userId}/tasks`, task.id);
    updateDoc(docRef, {
      status: "completed"
    }).then(
      ()=>{
        setShowModal(false)
      }
    )
  }
  return (
    <>
      <div
        className="flex justify-between items-center pb-4 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="flex space-x-2 items-center">
          <div className=" rounded-md bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userPic}
              alt="profile"
              className="h-10 cursor-pointer rounded-full"
            />
          </div>
          <h1>{task.title}</h1>
        </div>
        <span
          className={
            task.priorityValue?.toLowerCase() == "high"
              ? "rounded-md text-white px-2 text-xs py-1 bg-red-500"
              : task.priorityValue?.toLowerCase() == "mid"
              ? "rounded-md text-white px-2 text-xs py-1 bg-yellow-500"
              : "rounded-md text-white px-2 text-xs py-1 bg-blue-500"
          }
        >
          {task.priorityValue}
        </span>
      </div>
      <div className="text-gray-400 pb-4 cursor-pointer" onClick={() => setShowModal(true)}>
        {task.description.slice(0, 30)}
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto min-w-[70vw] my-6 mx-auto max-w-4xl">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between border-b border-solid">
                  <div className="flex items-start justify-between py-6 pl-10 border-b border-solid border-slate-200 rounded-t grow">
                    <h3 className="text-xl font-semibold pt-1">Task Details</h3>
                    <div className="flex space-x-2 pt-2">
                      <span
                        className={
                          remainingTime == null
                            ? "opacity-0"
                            : "rounded-sm bg-gray-100 text-gray-500 px-3 text-xs py-[3px] cursor-pointer"
                        }
                      >
                        Est. {remainingTime}
                      </span>
                      <span className="rounded-sm bg-gray-100 text-gray-500 px-3 text-xs py-[3px] cursor-pointer">
                        View Attachments
                      </span>
                      <PaperClipIcon className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  <button
                    className="w-4 h-4 bg-slate-700 flex justify-center items-center text-white rounded-full text-[9px] m-2"
                    onClick={() => setShowModal(false)}
                  >
                    x
                  </button>
                </div>
                {/*body*/}
                <div className="flex">
                  <div className="rounded-md ml-12 mr-5 pt-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={userPic}
                      alt="profile"
                      className="h-10 cursor-pointer rounded-full"
                    />
                  </div>
                  <div>
                    <div className="pt-5">
                      <div className="mb-8">
                        <h1 className="font-medium text-lg">
                          {task.title}
                        </h1>
                        <p className="text-sm text-gray-500 pt-1">
                          {task.description}
                        </p>
                      </div>
                      <p className="font-medium text-sm">Description</p>
                      <p className="text-xs text-gray-500 pt-1">
                        {task.description}
                      </p>
                    </div>
                    <div className="pt-5">
                      <p className="font-medium text-sm">Due Date</p>
                      <div className="flex text-md font-normal items-center space-x-3 pt-5">
                        <span>{new Date(task.dueDateTime).getDate()}</span>
                        <span className="bg-[#004064] py-4 px-2 text-xs text-white rounded-lg">
                        {new Date(task.dueDateTime).toLocaleDateString('en-us',{month: 'long'}).slice(0,3).toLowerCase()}
                        </span>
                        <span>{new Date(task.dueDateTime).getFullYear().toString().slice(2,4)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex justify-center space-x-5 mt-36 mb-10">
                  <button
                    className="bg-[#004064] rounded-md text-white w-48 py-3 text-xs"
                    onClick={() =>handleMarkComplete()}
                  >
                    Mark Complete
                  </button>
                  <button
                    className="rounded-md border-2 border-slate-500 text-slate-800 w-48 py-3 text-xs"
                    onClick={() => setShowModal(false)}
                  >
                    Send Files
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

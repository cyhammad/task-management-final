import React, { useEffect, useState } from "react";
import { PaperClipIcon, UserIcon } from "@heroicons/react/24/outline";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import TaskOptions from "./TaskOptions";
import CommentsModal from "./CommentsModal";
import Image from "next/image";

export default function TaskModal({ task, projectTask }) {
  const [showModal, setShowModal] = useState(false);
  const [userPic, setUserPic] = useState("");
  const [remainingTime, setRemainingTime] = useState(null);
  useEffect(() => {
    if (task.userId != undefined) {
      const docRef = doc(db, "users", task.userId);
      getDoc(docRef).then((docSnap) => {
        console.log(docSnap.data());
        docSnap.data()?.profilePic != undefined &&
          setUserPic(docSnap.data().profilePic);
      });
    }
  }, [task]);
  useEffect(() => {
    const date = new Date();
    const dueDate = new Date(task.dueDateTime);
    const diff = new Date(date.getTime() - dueDate.getTime());
    setRemainingTime(
      diff.getUTCDay() +
        "D " +
        diff.getUTCHours() +
        "hr " +
        diff.getUTCMinutes() +
        "m"
    );
  }, [task]);
  const handleMarkComplete = async () => {
    console.log("dasdas:", task.taskId);
    const docRef = doc(db, `users/${task.userId}/tasks`, task.taskId);
    updateDoc(docRef, {
      status: "completed",
    }).then(() => {
      setShowModal(false);
    });
  };
  return (
    <>
      <div
        className="flex justify-between items-center pb-4 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="flex space-x-2 items-center max-w-[80%]">
          <div className=" rounded-md bg-white">
            {userPic !== "" ? (
              <Image
                src={userPic}
                alt="profile"
                height={40}
                width={40}
                className="h-10 cursor-pointer rounded-full"
              />
            ) : (
              <div className="h-10 w-10 bg-blue-50 rounded-full flex justify-center items-center cursor-pointer">
                <UserIcon className="h-6 w-6 text-blue-500" />
              </div>
            )}
          </div>
          <h1>
            {task.title.slice(0, 15)}
            {task.title.length > 15 ? " . . ." : null}
          </h1>
        </div>
        <span
          className={
            task.priorityValue?.toLowerCase() == "high"
              ? "rounded-md text-white px-2 text-xs py-1 bg-[#FF3743]"
              : task.priorityValue?.toLowerCase() == "mid" ||
                task.priorityValue?.toLowerCase() == "normal"
              ? "rounded-md text-white px-2 text-xs py-1 bg-[#00CC14]"
              : "rounded-md text-white px-2 text-xs py-1 bg-[#0093E5]"
          }
        >
          {task.priorityValue == undefined ||
          task.priorityValue.toLowerCase() == "normal"
            ? "Mid"
            : task.priorityValue}
        </span>
      </div>
      <div
        className="text-gray-400 pb-4 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {task.description.slice(0, 30)}
      </div>
      <CommentsModal
        taskId={task.taskId}
        userId={task.userId}
        taskType={"quicktask"}
      />
      <div
        className={
          task.status == undefined && task.dueDateTime == undefined
            ? "hidden"
            : "flex justify-between pb-4"
        }
      >
        <span
          className={
            task.status == undefined
              ? "opacity-0"
              : "h-fit rounded-md bg-[#1D95E9] text-white px-2 py-[2px] text-xs flex items-center cursor-pointer"
          }
        >
          {task.status}
        </span>
        <span
          className={
            task.dueDateTime == undefined
              ? "opacity-0"
              : "rounded-sm bg-gray-200 text-gray-500 px-2 py-[2px] text-xs flex items-center h-fit ml-5 cursor-pointer"
          }
        >
          Est. {remainingTime}
        </span>
      </div>
      {projectTask ? null : (
        <TaskOptions
          task={task.title == undefined ? task.data() : task}
          openModel={setShowModal}
        />
      )}
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
                    {userPic !== "" ? (
                      <Image
                        src={userPic}
                        alt="profile"
                        height={40}
                        width={40}
                        className="h-10 cursor-pointer rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-blue-50 rounded-full flex justify-center items-center cursor-pointer">
                        <UserIcon className="h-6 w-6 text-blue-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="pt-5">
                      <div className="mb-8">
                        <h1 className="font-medium text-lg">{task.title}</h1>
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
                          {new Date(task.dueDateTime)
                            .toLocaleDateString("en-us", { month: "long" })
                            .slice(0, 3)
                            .toLowerCase()}
                        </span>
                        <span>
                          {new Date(task.dueDateTime)
                            .getFullYear()
                            .toString()
                            .slice(2, 4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex justify-center space-x-5 mt-36 mb-10">
                  <button
                    className="bg-[#004064] rounded-md text-white w-48 py-3 text-xs"
                    onClick={() => handleMarkComplete()}
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

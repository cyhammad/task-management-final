import React, { useEffect, useState, useRef } from "react";
import { PaperClipIcon, PlusIcon, UserIcon } from "@heroicons/react/24/outline";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import TaskOptions from "./TaskOptions";
import CommentsModal from "./CommentsModal";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowLongLeftIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import Attachment from "./Attachment";
import ProjectTaskOptions from "./ProjectTaskOptions";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function TaskModal({ task, projectTask, projectId }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendFileModal, setSendFileModal] = useState(false);
  const [viewAttachment, setViewAttachment] = useState(false);
  const [userPic, setUserPic] = useState("");
  const [remainingTime, setRemainingTime] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filename, setFilename] = useState("");
  const filePickerRef = useRef(null);
  useEffect(() => {
    if (task.userId != undefined) {
      const docRef = doc(db, "users", task.userId);
      getDoc(docRef).then((docSnap) => {
        docSnap.data()?.profilePic != undefined &&
          setUserPic(docSnap.data().profilePic);
      });
    }
  }, [task]);
  useEffect(() => {
    const date = new Date();
    const dueDate = new Date(task.dueDateTime);
    const diff = dueDate - date;
    const diffMins = Math.round(diff / 60000);
    const diffHours = Math.round(diff / 3600000);
    const diffDays = Math.round(diff / 86400000);
    if (diffMins < 0) {
      setRemainingTime("Overdue");
    } else if (diffMins < 60) {
      setRemainingTime(`Est. ${diffMins} mins`);
    } else if (diffHours < 24) {
      setRemainingTime(`Est. ${diffHours} hrs`);
    } else {
      setRemainingTime(`Est. ${diffDays} days`);
    }
  }, [task]);
  const handleMarkComplete = async () => {
    const markQuery = !projectTask
      ? `users/${task.userId}/tasks`
      : `users/${task.userId}/projects/${projectId}/subtasks`;
    const docRef = doc(db, markQuery, task.taskId);
    updateDoc(docRef, {
      status: "completed",
      isPending: false,
    }).then(() => {
      setShowModal(false);
    });
  };
  const addFileToAttach = async (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
      setFilename(e.target.files[0].name);
    };
  };
  const sendFile = async () => {
    console.log("SELECTED FILE", selectedFile);
    setLoading(true);
    const fileRef = ref(storage, `tasks/${task.taskId}/${filename}`);
    console.log("Sending attachment.", fileRef, selectedFile);

    await uploadString(fileRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(fileRef);

        const docRef = await addDoc(
          collection(
            db,
            `users/${auth.currentUser.uid}/chats/${task.userId}-chat/messages`
          ),
          {
            message: downloadURL,
            from: auth.currentUser.uid,
            to: task.userId,
            timeSent: serverTimestamp(),
            isSeen: false,
          }
        );
        // if (projectTask){
        //   await updateDoc(
        //     doc(
        //       db,
        //       `users/${task.userId}/projects/${projectId}/subtasks`,
        //       task.taskId
        //     ),
        //     {
        //       files: arrayUnion({fileUrl: downloadURL, fileName: filename}),
        //     }
        //   );
        // }else{
        //   await updateDoc(
        //     doc(
        //       db,
        //       `users/${task.userId}/tasks`,
        //       task.taskId
        //     ),
        //     {
        //       files: arrayUnion({fileUrl: downloadURL, fileName: filename}),
        //     }
        //   );
        // }
      }
    );
    setSelectedFile(null);
    setLoading(false);
    setSendFileModal(false);
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
          <h1 className="break-words w-[65%]">
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
        className="text-gray-400 pb-4 cursor-pointer break-words w-full"
        onClick={() => setShowModal(true)}
      >
        {task.description.slice(0, 100)}
        {task.description.length > 100 ? " ..." : null}
      </div>
      {projectTask ? (
        <CommentsModal
          projectId={projectId}
          projectTaskId={task.taskId}
          userId={task.userId}
          taskType={"projectTask"}
          access={"modal"}
          taskName={task.title}
        />
      ) : (
        <CommentsModal
          taskId={task.taskId}
          userId={task.userId}
          taskType={"quicktask"}
          access={"modal"}
          taskName={task.title}
        />
      )}
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
          {remainingTime}
        </span>
      </div>
      {projectTask ? (
        <ProjectTaskOptions
          task={task}
          openModel={setShowModal}
          openAttachment={setViewAttachment}
          projectId={projectId}
          right={
            task.status == undefined || task.status == "new" ? false : true
          }
        />
      ) : (
        <TaskOptions
          task={task.title == undefined ? task.data() : task}
          openModel={setShowModal}
          openAttachment={setViewAttachment}
          right={
            task.status == undefined || task.status == "new" ? false : true
          }
        />
      )}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none px-1 max-h-screen">
            <div className="relative w-auto min-w-[70vw] my-6 mx-auto max-w-4xl">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between border-b border-solid">
                  <div className="flex flex-col sm:flex-row items-start justify-between py-6 pl-10 border-b border-solid border-slate-200 rounded-t grow">
                    <h3 className="text-xl font-semibold pt-1">Task Details</h3>
                    <div className="flex space-x-2 pt-2">
                      <span
                        className={
                          remainingTime == null
                            ? "opacity-0"
                            : "rounded-sm bg-gray-100 text-gray-500 px-3 text-xs py-[3px] cursor-pointer"
                        }
                      >
                        {remainingTime}
                      </span>
                      <span
                        className="rounded-sm bg-gray-100 text-gray-500 px-3 text-xs py-[3px] cursor-pointer"
                        onClick={() => {
                          setShowModal(false);
                          setViewAttachment(true);
                        }}
                      >
                        View Attachments
                      </span>
                      <PaperClipIcon
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={() => {
                          setShowModal(false);
                          setViewAttachment(true);
                        }}
                      />
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
                <div className="flex w-full">
                  <div className="rounded-md ml-10 mr-5 pt-5">
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
                  <div className="w-full">
                    <div className="pt-5 w-[80%]">
                      <div className="mb-8 w-full">
                        <h1 className="font-medium text-lg break-words">
                          {task.title}
                        </h1>
                        <p className="text-sm text-gray-500 pt-1 break-words">
                          {task.description.slice(0, 24)}
                        </p>
                      </div>
                      <p className="font-medium text-sm">Description</p>
                      <p className="text-xs pr-10 text-gray-500 pt-1 break-words h-20 overflow-auto scrollbar w-[70%] sm:w-full">
                        {task.description}
                      </p>
                    </div>
                    <div className="pt-5 w-[50%] sm:w-[80%]">
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
                    <div className="flex flex-col sm:flex-row text-xs mt-4 space-y-3 sm:space-y-0 sm:space-x-3">
                      {projectTask ? (
                        <CommentsModal
                          projectId={projectId}
                          projectTaskId={task.taskId}
                          userId={task.userId}
                          taskType={"projectTask"}
                          access={"addbutton"}
                          onClick={() => setShowModal(false)}
                        />
                      ) : (
                        <CommentsModal
                          taskId={task.taskId}
                          userId={task.userId}
                          taskType={"quicktask"}
                          access={"addbutton"}
                          onClick={() => setShowModal(false)}
                        />
                      )}
                      {projectTask ? (
                        <CommentsModal
                          projectId={projectId}
                          projectTaskId={task.taskId}
                          userId={task.userId}
                          taskType={"projectTask"}
                          access={"viewbutton"}
                          onClick={() => setShowModal(false)}
                        />
                      ) : (
                        <CommentsModal
                          taskId={task.taskId}
                          userId={task.userId}
                          taskType={"quicktask"}
                          access={"viewbutton"}
                          onClick={() => setShowModal(false)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex flex-col items-center sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-5 mt-10 sm:mt-20 md:mt-32 mb-10">
                  <button
                    className="bg-[#004064] rounded-md text-white w-48 py-3 text-xs"
                    onClick={() => handleMarkComplete()}
                  >
                    Mark Complete
                  </button>
                  <button
                    className="rounded-md border-2 border-slate-500 text-slate-800 w-48 py-3 text-xs"
                    onClick={() => setSendFileModal(true)}
                  >
                    Send Files
                  </button>
                  <input
                    ref={filePickerRef}
                    onChange={addFileToAttach}
                    type="file"
                    hidden
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      {viewAttachment ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto min-w-[70vw] my-6 mx-auto max-w-4xl">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between border-b border-solid">
                  <div className="flex items-center py-6 pl-10 border-b border-solid border-slate-200 rounded-t grow">
                    <ArrowLeftIcon
                      className="h-5 w-5 mr-5 pt-1"
                      onClick={() => {
                        setViewAttachment(false);
                        setShowModal(true);
                      }}
                    />
                    <h3 className="text-xl font-semibold pt-1">Attachments</h3>
                  </div>
                  <button
                    className="w-4 h-4 bg-slate-700 flex justify-center items-center text-white rounded-full text-[9px] m-2"
                    onClick={() => setViewAttachment(false)}
                  >
                    x
                  </button>
                </div>
                {/*body*/}
                <div className="min-h-[350px]">
                  <div className="flex flex-wrap px-10 mt-5 items-start max-h-[300px] overflow-auto scrollbar">
                    {task.files.length !== 0 ? (
                      task.files.map((attachment) => (
                        <>
                          <Attachment
                            attachment={attachment}
                            key={attachment.fileUrl}
                          />
                        </>
                      ))
                    ) : (
                      <p className="text-gray-500 h-52">No attachments</p>
                    )}
                  </div>
                </div>
                {/*footer*/}
                <div className="flex justify-center space-x-5 mt-10 mb-10">
                  <button
                    className="rounded-md border-2 border-slate-500 text-slate-800 w-48 py-3 text-xs"
                    onClick={() => {
                      setShowModal(true);
                      setViewAttachment(false);
                    }}
                  >
                    Back to Project
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      {sendFileModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-4xl lg:min-w-[600px]">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between border-b border-solid">
                  <div className="flex items-start justify-between py-6 pl-10 border-b border-solid border-slate-200 rounded-t grow">
                    <h3 className="text-xl font-semibold pt-1">Send File</h3>
                  </div>
                  <button
                    className="w-4 h-4 bg-slate-700 flex justify-center items-center text-white rounded-full text-[9px] m-2"
                    onClick={() => setSendFileModal(false)}
                  >
                    x
                  </button>
                </div>
                {/*body*/}
                <div className="flex justify-center items-center pt-8">
                  {selectedFile ? (
                    <div className="bg-blue-50 p-8 flex justify-center items-center rounded-xl">
                      <div
                        onClick={() => filePickerRef.current.click()}
                        className="bg-[#004064] flex justify-center items-center text-white px-2 py-2 rounded-lg cursor-pointer"
                      >
                        <DocumentTextIcon className="h-6 w-6" />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 p-8 flex justify-center items-center rounded-xl">
                      <div
                        onClick={() => filePickerRef.current.click()}
                        className="bg-[#004064] flex justify-center items-center text-white px-2 py-2 rounded-lg cursor-pointer"
                      >
                        <PlusIcon className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={filePickerRef}
                  onChange={addFileToAttach}
                  type="file"
                  hidden
                />
                <div className="flex flex-col items-center  justify-center pt-3">
                  <p className="font-medium">Uplooad File</p>
                </div>
                {/*footer*/}
                <div className="flex flex-col justify-center items-center space-y-5 mt-10 mb-10 px-10">
                  <button
                    className="bg-[#004064] disabled:bg-gray-500 rounded-md text-white w-48 py-3 text-xs"
                    onClick={sendFile}
                    disabled={!selectedFile}
                  >
                    {loading ? "Sending File..." : "Send File in Chat"}
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

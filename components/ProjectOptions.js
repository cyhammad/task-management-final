import React, { useState } from "react";
import {
  EllipsisHorizontalIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";
import Attachment from "./Attachment";
import CommentsModal from "./CommentsModal";
import Link from "next/link";
import DeleteProjectButton from "./DeleteProjectButton";

function ProjectOptions({ projectId, userId, taskNumber, right, files }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  const [viewAttachment, setViewAttachment] = useState(false);
  const router = useRouter();
  const viewDetails = () => {
    taskNumber != 0
      ? router.push(`/projecttasks/${userId}/${projectId}`)
      : alert("No tasks in this project");
  };
  const updateStatus = async (status) => {
    const docRef = doc(db, `users/${userId}/projects`, projectId);
    updateDoc(docRef, {
      status: status,
    }).then(() => {
      setShowOptions(false);
      setShowUpdateOptions(false);
    });
  };
  const archiveAfter30Days = async () => {
    const date = new Date();
    const next = new Date(date);
    next.setDate(next.getDate() + 30);
    console.log("date: ", next);
    const docRef = doc(db, `users/${userId}/projects`, projectId);
    updateDoc(docRef, {
      archiveDate: next,
    }).then(() => {
      setShowOptions(false);
      setShowUpdateOptions(false);
    });
  };
  return (
    <div className="flex flex-col items-end justify-end cursor-pointer relative">
      <EllipsisHorizontalIcon
        className="h-8 w-8"
        onClick={() => {
          setShowOptions(!showOptions);
          setShowUpdateOptions(false);
        }}
      />
      <div
        className={`absolute flex flex-col w-[155px] top-5 rounded bg-[#282828] ${
          showOptions ? null : "hidden"
        } text-white w-fit`}
        onMouseLeave={() => {
          setShowOptions(false);
          setShowUpdateOptions(false);
        }}
      >
        <button className="px-8 py-1 text-sm" onClick={() => viewDetails()}>
          View details
        </button>
        <button
          className="border-t border-white py-1 text-sm"
          onMouseEnter={() => setShowUpdateOptions(true)}
        >
          Update Status
        </button>
        <div
          className={`bg-[#282828] absolute ${
            right ? "left-[-220px]" : "left-[150px]"
          } z-10 top-[28px] w-[220px] ${showUpdateOptions ? null : "hidden"}`}
          onMouseLeave={() => setShowUpdateOptions(false)}
        >
          <button
            className="px-5 py-1 text-sm w-[220px] text-start"
            onClick={() => updateStatus("todo")}
          >
            Assigned
          </button>
          <button
            className="px-5 py-1 text-sm w-[220px] text-start border-t border-white"
            onClick={() => updateStatus("inprogress")}
          >
            In Progress
          </button>
          <button
            className="px-5 py-1 text-sm w-[220px] text-start border-t border-white"
            onClick={() => updateStatus("pendingClientReview")}
          >
            Pending Client Review
          </button>
          <button
            className="px-5 py-1 text-sm w-[220px] text-start border-t border-white"
            onClick={() => updateStatus("pending3rdParty")}
          >
            Pending 3rd Party Action
          </button>
          <button
            className="px-5 py-1 text-sm w-[220px] text-start border-t border-white"
            onClick={() => updateStatus("revision")}
          >
            Revision
          </button>
          <button
            className="px-5 py-1 text-sm w-[220px] text-start border-t border-white"
            onClick={() => updateStatus("readyForReview")}
          >
            Ready for review
          </button>
          <button
            className="px-5 py-1 text-sm w-[220px] text-start border-t border-white"
            onClick={() => updateStatus("completed")}
          >
            Completed
          </button>
          <button
            className="px-5 py-1 text-sm w-[220px] text-start border-t border-white"
            onClick={() => archiveAfter30Days()}
          >
            Archive After 30 days
          </button>
        </div>
        <button
          className="border-t border-white py-1 text-sm"
          onClick={() => {
            setViewAttachment(true);
            setShowOptions(false);
            setShowUpdateOptions(false);
          }}
        >
          Attachments
        </button>
        <CommentsModal
          projectId={projectId}
          userId={userId}
          taskType={"projecttask"}
          access={"options"}
          onClick={() => {
            setShowOptions(false);
            setShowUpdateOptions(false);
          }}
        />
        <Link href="/chats">
          <button className="border-t border-white py-1 text-sm">Chat</button>
        </Link>
        <DeleteProjectButton projectId={projectId} userId={userId} />
      </div>
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
                <div className="flex flex-wrap px-10 mt-5 min-h-[300px] items-start max-h-[300px] overflow-auto scrollbar">
                  {files.length !== 0 ? (
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
                {/*footer*/}
                <div className="flex justify-center space-x-5 mt-10 mb-10">
                  <button
                    className="rounded-md border-2 border-slate-500 text-slate-800 w-48 py-3 text-xs"
                    onClick={() => {
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
    </div>
  );
}

export default ProjectOptions;

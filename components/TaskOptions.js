import React, { useState } from "react";
import {
  EllipsisHorizontalIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import CommentsModal from "./CommentsModal";
import DeleteTaskButton from "./DeleteTaskButton";
import Link from "next/link";

function TaskOptions({ task, openModel, openAttachment, right }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  const updateStatus = async (status) => {
    const docRef = doc(db, `users/${task.userId}/tasks`, task.taskId);
    updateDoc(docRef, {
      status: status,
      isPending: status == "completed" ? false : true,
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
    const docRef = doc(db, `users/${task.userId}/tasks`, task.taskId);
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
        className={`absolute flex flex-col w-[158px] top-5 rounded bg-[#282828] ${
          showOptions ? null : "hidden"
        } text-white w-fit`}
        onMouseLeave={() => {
          setShowOptions(false);
          setShowUpdateOptions(false);
        }}
      >
        <button className="px-8 py-1 text-sm" onClick={() => openModel(true)}>
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
            openAttachment(true);
            setShowOptions(false);
          }}
        >
          Attachments
        </button>
        <CommentsModal
          taskId={task.taskId}
          userId={task.userId}
          taskType={"quicktask"}
          access={"options"}
        />
        <Link href="/chats">
          <button className="border-t border-white py-1 text-sm">Chat</button>
        </Link>
        <DeleteTaskButton task={task} />
      </div>
    </div>
  );
}

export default TaskOptions;

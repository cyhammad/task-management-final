import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import DeleteProjectTaskButton from "./DeleteProjectTaskButton";
import Link from "next/link";

function ProjectTaskOptions({ task, projectId }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  const updateStatus = async (status) => {
    const docRef = doc(
      db,
      `users/${task.userId}/projects/${projectId}/subtasks`,
      task.taskId
    );
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
    const docRef = doc(
      db,
      `users/${task.userId}/projects/${projectId}/subtasks`,
      task.taskId
    );
    updateDoc(docRef, {
      archiveDate: next,
    }).then(() => {
      setShowOptions(false);
      setShowUpdateOptions(false);
    });
  };
  return (
    <div
      className="flex flex-col items-end justify-end cursor-pointer relative"
      onClick={() => setShowOptions(!showOptions)}
    >
      <EllipsisHorizontalIcon className="h-8 w-8" />
      <div
        className={`absolute flex flex-col w-[155px] top-5 rounded bg-[#282828] ${
          showOptions ? null : "hidden"
        } text-white w-fit`}
        onMouseLeave={() => {
          setShowOptions(false);
          setShowUpdateOptions(false);
        }}
      >
        <button className="px-8 py-1 text-sm">View details</button>
        <button
          className="border-t border-white py-1 text-sm"
          onMouseEnter={() => setShowUpdateOptions(true)}
        >
          Update Status
        </button>
        <div
          className={`bg-[#282828] absolute left-[150px] top-[28px] w-[220px] ${
            showUpdateOptions ? null : "hidden"
          }`}
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
        <button className="border-t border-white py-1 text-sm">
          Attachments
        </button>
        <Link href="/chats">
          <button className="border-t border-white py-1 text-sm">Chat</button>
        </Link>
        <DeleteProjectTaskButton projectId={projectId} task={task} />
      </div>
    </div>
  );
}

export default ProjectTaskOptions;

import React, { useState } from "react";
import {
  EllipsisHorizontalIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";

function ProjectOptions({ projectId, userId, taskNumber }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  const router = useRouter();
  const viewDetails = () => {
    taskNumber != 0 ? router.push(`/projecttasks/${userId}/${projectId}`) : alert("No tasks in this project");
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
        <button className="px-8 py-1 text-sm" onClick={()=>viewDetails()}>
          View details
        </button>
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
            onClick={() => updateStatus("inprogress")}
          >
            Pending Client Review
          </button>
          <button
            className="px-5 py-1 text-sm w-[220px] text-start border-t border-white"
            onClick={() => updateStatus("inprogress")}
          >
            Pending 3rd Party Action
          </button>
          <button
            className="px-5 py-1 text-sm w-[220px] text-start border-t border-white"
            onClick={() => updateStatus("todo")}
          >
            Revision
          </button>
          <button
            className="px-5 py-1 text-sm w-[220px] text-start border-t border-white"
            onClick={() => updateStatus("inprogress")}
          >
            Ready for review
          </button>
          <button
            className="px-5 py-1 text-sm w-[220px] text-start border-t border-white"
            onClick={() => updateStatus("completed")}
          >
            Completed
          </button>
          <button className="px-5 py-1 text-sm w-[220px] text-start border-t border-white">
            Archive After 30 days
          </button>
        </div>
        <button className="border-t border-white py-1 text-sm">
          Attachments
        </button>
      </div>
    </div>
  );
}

export default ProjectOptions;
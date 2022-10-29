import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function ProjectTaskOptions({task, projectId}) {
  const [showOptions, setShowOptions] = useState(false);
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  const updateStatus = async (status) => {
    const docRef = doc(db, `users/${task.userId}/projects`, projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()){
        const oldTasks = docSnap.data().tasks;
        const prevDoc = oldTasks.filter((t)=>t.taskId == task.taskId)[0];
        const updatedDoc = {...prevDoc, status: status}   
        const newTasks = oldTasks.filter((t)=>t.taskId != task.taskId);
        newTasks.push(updatedDoc)
        updateDoc(docRef, {
            tasks: newTasks
        }).then(()=>{
            console.log("Added")
        })
    }
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

export default ProjectTaskOptions;

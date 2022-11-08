import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db } from "../firebase";

function DeleteProjectTaskButton({task, projectId}) {
    const handleDelete = async () => {
        await deleteDoc(doc(db, `users/${task.userId}/projects/${projectId}/subtasks`, task.taskId));
    }
  return (
    <button className="px-8 py-1 text-sm border-t border-white" onClick={() => handleDelete()}>
      Delete
    </button>
  );
}

export default DeleteProjectTaskButton;
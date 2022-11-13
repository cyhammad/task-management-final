import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db } from "../firebase";

function DeleteProjectButton({projectId, userId}) {
    const handleDelete = async () => {
        await deleteDoc(doc(db, `users/${userId}/projects`, projectId));
    }
  return (
    <button className="px-8 py-1 text-sm border-t border-white" onClick={() => handleDelete()}>
      Delete
    </button>
  );
}

export default DeleteProjectButton;

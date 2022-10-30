import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { db, auth } from "../firebase";

function DeleteUserModal({ selectedUsers, multiple }) {
  const [showModal, setShowModal] = useState(false);
  const deleteUser = async (id) => {
    console.log("delete user", id);
    await deleteDoc(doc(db, "users", id));
    await deleteDoc(
      doc(db, `users/${auth.currentUser.uid}/chats`, id + "-chat")
    );
    window.location.reload(false);
  };
  const handleDelete = async () => {
    console.log("su", selectedUsers)
    selectedUsers.forEach((user) => {
      deleteUser(user.uid);
    });
  };
  return (
    <div>
      {multiple ? (
        <div className="text-white bg-[#004064] py-[6px] pl-2 pr-3 text-xs rounded flex items-center gap-x-1 cursor-pointer" onClick={()=>setShowModal(true)}>
          <TrashIcon className="h-4 w-4" />
          Delete Multiple
        </div>
      ) : (
        <div
          className="w-[4%] text-[#004064]"
          onClick={() => setShowModal(true)}
        >
          <TrashIcon className="w-5 h-5 grow" />
        </div>
      )}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-4xl lg:min-w-[600px]">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between border-b border-solid">
                  <div className="flex items-start justify-between py-6 pl-10 border-b border-solid border-slate-200 rounded-t grow">
                    <h3 className="text-xl font-semibold pt-1">Delete User</h3>
                  </div>
                  <button
                    className="w-4 h-4 bg-slate-700 flex justify-center items-center text-white rounded-full text-[9px] m-2"
                    onClick={() => setShowModal(false)}
                  >
                    x
                  </button>
                </div>
                <div className="p-10">
                  Deleting the user will also delete all the projects and quicks
                  tasks given by the user. Are you sure you want to delete the
                  user?
                  <div className="text-gray-300 text-center text-sm pt-10">
                    This will cause a reload of this page
                  </div>
                </div>
                <div className="flex justify-center space-x-5 pb-10">
                  <button
                    className="bg-[#004064] px-8 py-2 text-white rounded"
                    onClick={() => handleDelete()}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-white px-8 py-2 text-[#004064] rounded border border-[#004064]"
                    onClick={() => setShowModal(false)}
                  >
                    No
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

export default DeleteUserModal;

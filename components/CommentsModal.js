import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

import {
  ChatBubbleOvalLeftEllipsisIcon,
  PaperAirplaneIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { auth, db } from "../firebase";
import {
    addDoc,
  collection,
  collectionGroup,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import Comment from "./Comment";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

function CommentsModal({ task, taskType }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [inpComment, setInpComment] = useState("");

  useEffect(() => onSnapshot(
    query(collection(db, `users/${task.userId}/tasks/${task.taskId}/comments`), orderBy("createdAt")),
    (snapshot) => setComments(snapshot.docs)
  ), [db]);
  const addComment = async () => {
    const inpcom = inpComment;
    setInpComment("");
    const docRef = await addDoc(
        collection(
            db,
            `users/${task.userId}/tasks/${task.taskId}/comments`
        ),{
            addedBy: auth.currentUser.uid,
            comment: inpcom,
            createdAt: serverTimestamp(),
            likedBy: [],
        }   
    )
    console.log("Comment added with ", docRef.id)
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addComment();
    }
  };
  return (
    <div className={comments.length == 0 ? "hidden": ""}>
      <div
        className={
          comments.length == undefined
            ? "hidden"
            : "flex space-x-2 items-center cursor-pointer"
        }
        onClick={() => setShowModal(true)}
      >
        <div className=" rounded-md bg-white">
          <Image
            src={auth.currentUser.photoURL}
            alt="profile"
            height={12}
            width={12}
            className="h-10 cursor-pointer rounded-full"
          />
        </div>
        <p className="text-xs flex items-center text-gray-400 my-2">
          {comments.length} comments
          <ChatBubbleOvalLeftEllipsisIcon className="h-3 w-3 ml-1" />
        </p>
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-4xl lg:min-w-[70vw]">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between border-b border-solid">
                  <div className="flex justify-between items-center py-6 pl-10 border-b border-solid border-slate-200 rounded-t grow">
                    <div className=" rounded-md bg-white">
                      <Image
                        src={auth.currentUser.photoURL}
                        alt="profile"
                        height={50}
                        width={50}
                        className="h-10 cursor-pointer rounded-full"
                      />
                    </div>
                    <div className="px-5 py-4 grow border border-blue-200 rounded-md flex mx-2 bg-white">
                      <input
                        type="text"
                        className="bg-inherit w-full focus:outline-none"
                        placeholder="Type Comment ..."
                        onChange={(e) => setInpComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                        value={inpComment}
                      />
                      <PaperAirplaneIcon
                        className="h-7 w-7 mr-3 text-gray-500 hover:text-black cursor-pointer"
                        onClick={() => addComment()}
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
                {comments.map((comment) => (
                  <Comment comment={comment.data()} key={comment.id} taskId={task.taskId} commentId={comment.id} />
                ))}
                <div className="mb-10"></div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}

export default CommentsModal;

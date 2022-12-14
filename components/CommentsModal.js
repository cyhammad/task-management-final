import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

import {
  ChatBubbleOvalLeftEllipsisIcon,
  PaperAirplaneIcon,
  ArrowUturnLeftIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
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
import axios from "axios";

function CommentsModal({
  userId,
  projectId,
  taskId,
  projectTaskId,
  taskType,
  access,
  projectName,
  taskName,
}) {
  console.log("PN",projectName)
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [inpComment, setInpComment] = useState("");
  const [recipient, setRecepient] = useState("");
  useEffect(()=>{
    const userDoc = getDoc(doc(db, "users", userId)).then(
      (docSnap) => {
        setRecepient(docSnap.data());
      }
    );
  },[userId])
  const useEffectQuery =
    taskType == "quicktask"
      ? `users/${userId}/tasks/${taskId}/comments`
      : taskType == "projectTask"
      ? `users/${userId}/projects/${projectId}/subtasks/${projectTaskId}/comments`
      : `users/${userId}/projects/${projectId}/comments`;
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, useEffectQuery), orderBy("createdAt")),
        (snapshot) => {
          setComments(snapshot.docs);
          var replies = 0;
          var comments = 0;
          snapshot.docs.forEach((docIns) => {
            docIns.data().replies ? replies = replies + (replies = docIns.data().replies) : null;
            comments = comments + 1;
          });
          // setCommentCount(replies + comments);
          setCommentCount(comments);
        }
      ),
    [db]
  );
  const addComment = async () => {
    const inpcom = inpComment;
    setInpComment("");
    const docRef = await addDoc(collection(db, useEffectQuery), {
      addedBy: auth.currentUser.uid,
      comment: inpcom,
      createdAt: serverTimestamp(),
      likedBy: [],
      replies: 0,
    });
    console.log("Comment added with ", docRef.id);
    var data = JSON.stringify({
      "to": recipient.token,
      "notification": {
        "body": inpcom,
        "title": `Admin added a new comment on ${taskType == "quicktask"} ${taskType == "quicktask" || taskType == "projectTask" ? taskName : projectName}`,
      }
    });
    var config = {
      method: 'post',
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: { 
        'Authorization': 'Bearer AAAA7j_APoE:APA91bHYEq6k0otSNNtsrEvIaek_yNalzbo8ZGNN0QAe887_Xh8UV3FJdGCtOSTe2_u-OKal23aCyWJgcOHA7NGKYsnF3hC1zHbuiQ4HM5hmlNB8mgHAu4YDJ-p5uftZx4AyeTkZzXGa', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addComment();
    }
  };
  return (
    <div>
      {access == "options" && (
        <button
          className="border-t border-white py-1 text-sm w-full"
          onClick={() => setShowModal(true)}
        >
          Comments
        </button>
      )}
      {access == "addbutton" && (
        <button
          className="bg-[#004064] text-white px-2 py-1 rounded"
          onClick={() => setShowModal(true)}
        >
          Add Comment
        </button>
      )}
      {access == "viewbutton" && (
        <button
          className="bg-[#D9D9D9] px-2 py-1 rounded"
          onClick={() => setShowModal(true)}
        >
          View Comments
        </button>
      )}
      {access == "modal" && (
        <div
          className={
            comments.length == undefined || comments.length == 0
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
            {commentCount} comments
            <ChatBubbleOvalLeftEllipsisIcon className="h-3 w-3 ml-1" />
          </p>
        </div>
      )}
      {showModal ? (
        <>
          <div className="justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-4xl lg:min-w-[70vw]">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between border-b border-solid">
                  <div className="flex justify-between items-center py-6 pl-10 border-b border-solid border-slate-200 rounded-t grow">
                    <div className=" rounded-md bg-white">
                      {auth.currentUser.photoURL !== "" ? (
                        <Image
                          src={auth.currentUser.photoURL}
                          alt="profile"
                          height={50}
                          width={50}
                          className="h-10 cursor-pointer rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-blue-50 rounded-full flex justify-center items-center cursor-pointer">
                          <UserIcon className="h-6 w-6 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div className="px-5 py-4 grow border border-blue-200 rounded-md flex mx-2 bg-white text-black">
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
                <div className="overflow-auto scrollbar max-h-[60vh] min-h-[450px]">
                  {comments.map((comment) => (
                    <Comment
                      comment={comment.data()}
                      key={comment.id}
                      userId={userId}
                      taskId={taskId}
                      projectId={projectId}
                      projectTaskId={projectTaskId}
                      taskType={taskType}
                      commentId={comment.id}
                    />
                  ))}
                </div>
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

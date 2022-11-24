import React, { useEffect, useState } from "react";
import {
  ArrowLongLeftIcon,
  ArrowUturnLeftIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Image from "next/image";
import Reply from "./Reply";

function Comment({
  key,
  comment,
  taskId,
  userId,
  projectId,
  projectTaskId,
  taskType,
  commentId,
}) {
  const [user, setUser] = useState("");
  const [showReplyField, setShowReplyField] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyInput, setReplyInput] = useState("");
  const replyQuery =
    taskType == "quicktask"
      ? `users/${userId}/tasks/${taskId}/comments/${commentId}/replies`
      : taskType == "projectTask"
      ? `users/${userId}/projects/${projectId}/subtasks/${projectTaskId}/comments/${commentId}/replies`
      : `users/${userId}/projects/${projectId}/comments/${commentId}/replies`;
  const commentQuery =
    taskType == "quicktask"
      ? `users/${userId}/tasks/${taskId}/comments/${commentId}`
      : taskType == "projectTask"
      ? `users/${userId}/projects/${projectId}/subtasks/${projectTaskId}/comments/${commentId}`
      : `users/${userId}/projects/${projectId}/comments/${commentId}`;
  useEffect(() => {
    if (comment.addedBy != undefined) {
      const docRef = doc(db, "users", comment.addedBy);
      getDoc(docRef).then((docSnap) => {
        setUser(docSnap.data());
      });
    }
  }, [db]);
  useEffect(
    () =>
      onSnapshot(query(collection(db, replyQuery)), (snapshot) => {
        setReplies(snapshot.docs);
      }),
    [db]
  );
  const addReply = async () => {
    const inprep = replyInput;
    setReplyInput("");
    const docRef = await addDoc(collection(db, replyQuery), {
      addedBy: auth.currentUser.uid,
      reply: inprep,
      createdAt: serverTimestamp(),
      likedBy: [],
    });
    updateDoc(
      doc(db, commentQuery),
      {
        replies: replies.length + 1,
      }
    );
    console.log("Reply added with ", docRef.id);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addReply();
    }
  };
  const substractDate = (date) => {
    const today = new Date();
    const commentDate = date.toDate();
    const diff = today - commentDate;
    const diffMins = Math.round(diff / 60000);
    const diffHours = Math.floor(diff / 1000 / 60 / 60);
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    console.log("DAYS", diffDays);
    if (diffDays > 0) {
      return `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hours ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minutes ago`;
    } else {
      return "Just now";
    }
  };
  return (
    <>
      <div className="px-10 py-5 flex text-black">
        <div className="h-10">
          {user.profilePic !== "" ? (
            <Image
              src={user.profilePic}
              alt="profile"
              height={40}
              width={40}
              className="h-10 cursor-pointer rounded-full"
            />
          ) : (
            <div className="h-10 w-10 bg-blue-50 rounded-full flex justify-center items-center cursor-pointer">
              <UserIcon className="h-6 w-6 text-blue-500" />
            </div>
          )}
        </div>
        <div className="flex flex-col pl-3 w-full">
          <div className="flex items-center">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-400 leading-3 pl-5">
              {comment.createdAt ? substractDate(comment.createdAt) : ""}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{comment.comment}</p>
          </div>
          <div className="flex pt-2">
            <div className="flex  w-full text-xs text-[#004064]">
              <div
                className="flex pr-5 cursor-pointer"
                onClick={() => setShowReplyField(!showReplyField)}
              >
                <ArrowLongLeftIcon className="h-4 w-4" />
                <p className="pl-1">Reply</p>
              </div>
              <div className="flex">
                <HandThumbUpIcon className="h-4 w-4" />
                <p className="pl-1">{comment.likedBy?.length} Like</p>
              </div>
            </div>
          </div>
          <div className="">
            {replies.map((reply) => (
              <Reply key={reply.id} reply={reply} />
            ))}
          </div>
          <div className={showReplyField ? "flex pt-5 items-center" : "hidden"}>
            <div className=" rounded-md bg-white">
              <Image
                src={auth.currentUser.photoURL}
                alt="profile"
                height={40}
                width={40}
                className="h-10 cursor-pointer rounded-full"
              />
            </div>
            <div className="px-5 py-3 grow border border-blue-200 rounded-md flex mx-2 bg-white">
              <input
                type="text"
                className="bg-inherit w-full focus:outline-none"
                placeholder="Reply   ..."
                onChange={(e) => setReplyInput(e.target.value)}
                value={replyInput}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Comment;

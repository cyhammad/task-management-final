import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import DeleteProjectTaskButton from "./DeleteProjectTaskButton";
import Link from "next/link";
import axios from "axios";

function ProjectTaskOptions({ task, projectId, openAttachment, right }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);

  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    const userDoc = getDoc(doc(db, "users", task.userId)).then(
      (docSnap) => {
        setReceiver(docSnap.data());
      }
    );
  }, [task.userId]);

  const updateStatus = async (status) => {
    const docRef = doc(
      db,
      `users/${task.userId}/projects/${projectId}/subtasks`,
      task.taskId
    );
    updateDoc(docRef, {
      status: status,
      isPending: status == "completed" ? false : true,
    }).then(() => {
      setShowOptions(false);
      setShowUpdateOptions(false);
    });
    await addDoc(collection(db, `users/${task.userId}/notifications`), {
      isSeen: false,
      title: `Status Updated`,
      body: `Admin changed the status of your ${task.title} to ${status}`,
      sentBy: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
    var data = JSON.stringify({
      "to": receiver.token,
      "notification": {
        "body": 'Admin changed the status of your project task',
        "title": "Status Updated"
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
        className={`absolute flex flex-col w-[158px] top-5 rounded bg-[#282828] ${
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
        <Link href="/chats">
          <button className="border-t border-white py-1 text-sm">Chat</button>
        </Link>
        <DeleteProjectTaskButton projectId={projectId} task={task} />
      </div>
    </div>
  );
}

export default ProjectTaskOptions;

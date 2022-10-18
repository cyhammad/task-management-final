import React, { useEffect, useState } from "react";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

function OpenedMessage({ chatDetails }) {
  const [message, setMessage] = useState("");
  const [recipient, setRecepient] = useState([]);
  const [chatList, setChatList] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const userDoc = getDoc(doc(db, "users", chatDetails.with)).then(
      (docSnap) => {
        setRecepient(docSnap.data());
      }
    );
  }, [chatDetails]);
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(
            db,
            `users/${auth.currentUser.uid}/chats/${chatDetails.with}-chat/messages`
          ),
          orderBy("timeSent")
        ),
        (snapshot) => {
          setChatList(snapshot.docs);
        }
      ),
    [chatDetails]
  );
  const sendMessage = async () => {
    const msg = message;
    setMessage("");
    await addDoc(
      collection(
        db,
        `users/${chatDetails.with}/chats/${auth.currentUser.uid}-chat/messages`
      ),
      {
        message: msg,
        from: auth.currentUser.uid,
        timeSent: serverTimestamp(),
        isSeen: false,
      }
    );
    await addDoc(
      collection(
        db,
        `users/${auth.currentUser.uid}/chats/${chatDetails.with}-chat/messages`
      ),
      {
        message: msg,
        to: auth.currentUser.uid,
        timeSent: serverTimestamp(),
        isSeen: false,
      }
    );
    await setDoc(
      doc(
        db,
        `users/${auth.currentUser.uid}/chats`,
        `${chatDetails.with}-chat`
      ),
      {
        isSeen: false,
        recentMessage: msg,
        timeSent: serverTimestamp(),
        with: chatDetails.with,
      }
    );
    await setDoc(
      doc(
        db,
        `users/${chatDetails.with}/chats`,
        `${auth.currentUser.uid}-chat`
      ),
      {
        isSeen: false,
        recentMessage: msg,
        timeSent: serverTimestamp(),
        with: auth.currentUser.uid,
      }
    );
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  useEffect(() => {
    let chatscroll = document.getElementById("chatscroll");
    chatscroll.scrollTop = chatscroll.scrollHeight;
  });
  const printDate = (str) => {
    return str == null
      ? ""
      : str
          .toDate()
          .toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
  };
  return (
    <div className="flex flex-col justify-end h-full mx-5">
      <div
        className="flex items-center shadow-b-md"
        style={{ boxShadow: "0px 3px 0px #f0f0f0" }}
      >
        <Image
          src={recipient.profilePic}
          alt="profile"
          height={50}
          width={50}
          className="h-10 cursor-pointer rounded-full"
        />
        <div className="ml-3">{recipient.name}</div>
      </div>
      <div className="overflow-y-scroll scrollbar h-[45vh]" id="chatscroll">
        {chatList.map((msg) => {
          return (
            <>
              <div
                className={`flex  my-1 ${
                  msg.data().from ? "" : "flex-row-reverse"
                }`}
              >
                <div className="relative cursor-pointer">
                  <Image
                    src={msg.data().from ? recipient.profilePic : user.photoURL}
                    alt="profile"
                    height={50}
                    width={50}
                    className="h-10 cursor-pointer rounded-full"
                  />
                </div>
                <div
                  className={`h-fit flex items-end justify-between mx-3 py-1 px-2 shadow-md min-w-[50px] max-w-md rounded-lg ${
                    msg.data().from
                      ? "rounded-tl-none bg-white"
                      : "rounded-tr-none bg-[#F3F3F3]"
                  }`}
                >
                  <div className="px-2">{msg.data().message}</div>
                  <div className="text-xs text-end min-w-fit">
                    {printDate(msg.data().timeSent)}
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
      <div className="mt-5 px-5 py-6 border border-gray-200 rounded-md flex bg-white">
        <input
          type="text"
          className="bg-inherit w-full focus:outline-none"
          placeholder="Type Message ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <PaperClipIcon className="h-7 w-7 mr-3 text-gray-500 hover:text-black cursor-pointer" />
        <PaperAirplaneIcon
          className="h-7 w-7 mr-3 text-gray-500 hover:text-black cursor-pointer"
          onClick={() => sendMessage()}
        />
      </div>
    </div>
  );
}

export default OpenedMessage;

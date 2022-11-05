import { UserIcon } from "@heroicons/react/24/solid";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";

function Chat({ chatDetails, onClick }) {
  const [sender, setSender] = useState(null);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    const userDoc = getDoc(doc(db, "users", chatDetails.with)).then(
      (docSnap) => {
        setSender(docSnap.data());
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
          )
        ),
        (snapshot) => {
          console.log("snapshot", snapshot.docs);
          var count = 0;
          snapshot.docs.forEach((doc) => {
            doc.data().isSeen == false ? (count += 1) : null;
          });
          setUnread(count);
        }
      ),
    [chatDetails.with]
  );
  const printDate = () =>
    chatDetails.timeSent.toDate().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  return (
    <div onClick={onClick}>
      <div className="bg-white px-4 py-4 flex space-x-3 hover:bg-[#F3F3F3] cursor-pointer">
        <div className=" rounded-md bg-white">
          {sender != null ? (
            sender.profilePic !== "" ? (
              <Image
                src={sender.profilePic}
                alt="profile"
                height={40}
                width={40}
                className="h-10 cursor-pointer rounded-full"
              />
            ) : (
              <div className="h-10 w-10 bg-blue-50 rounded-full flex justify-center items-center cursor-pointer">
                <UserIcon className="h-6 w-6 text-blue-500" />
              </div>
            )
          ) : null}
        </div>
        <div className="flex justify-between w-full">
          <div>
            <div className="flex items-center">
              <p className="text-sm font-medium">
                {sender != null ? sender.name : ""}
              </p>
              {unread > 0 ? (
                <p className="rounded-full bg-[#4DAA5D] h-4 w-4 text-[10px] flex justify-center items-center p-0 ml-2 text-white">
                  {unread}
                </p>
              ) : null}
            </div>
            <div className="flex space-x-2 pt-1">
              <span className="text-[10px] text-gray-500">
                {chatDetails.recentMessage == null
                  ? "No Recent Message"
                  : chatDetails.recentMessage.length > 27
                  ? chatDetails.recentMessage.substring(0, 25) + "..."
                  : chatDetails.recentMessage}
              </span>
            </div>
          </div>
          <p className="text-[10px] font-medium min-w-fit">
            {chatDetails.timeSent == null ? "" : printDate()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chat;

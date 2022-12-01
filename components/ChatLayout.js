import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import Chat from "./Chat";

function ChatLayout() {
  const [users, setUsers] = useState([]);
  const [chatters, setChatters] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "users"),
          where("uid", "!=", auth.currentUser.uid)
        ),
        (snapshot) => {
          setUsers(snapshot.docs);
        }
      ),
    [db]
  );
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, `users/${auth.currentUser.uid}/chats`)),
        (snapshot) => {
          setChatters(snapshot.docs);
        }
      ),
    [db]
  );
  return (
    <div className="bg-[#F4F5F8] py-5 px-3 rounded-lg lg:block min-h-[70vh]">
      <div className="flex justify-between items-center font-medium mb-3">
        <p>{viewAll ? "All Users":"All Messages"}</p>
        <p
          className="text-xs cursor-pointer"
          onClick={() => setViewAll(!viewAll)}
        >
          {viewAll ? "View less" : "View all"}
        </p>
      </div>
      <div className="rounded-lg h-[60vh] overflow-y-auto scrollbar">
        {viewAll == true ? (
          <>
            {users.length > 0 ? (
              users.map((user) => {
                return (
                  <Chat
                    chatDetails={user.data()}
                    userPassed={true}
                    key={user.id}
                  />
                );
              })
            ) : (
              <p className="text-center text-gray-500">No Users Created</p>
            )}
          </>
        ) : (
          <>
            {chatters.length > 0 ? (
              chatters.map((chat) => {
                return <Chat chatDetails={chat.data()} key={chat.id} />;
              })
            ): (
              <p className="text-center text-gray-500">No Messages</p>
            )}
          </>
        )}


      </div>
    </div>
  );
}

export default ChatLayout;

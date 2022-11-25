import React, { useEffect, useRef, useState } from "react";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
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
import { auth, db, storage } from "../firebase";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import axios from "axios";

function OpenedMessage({ chatDetails }) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [recipient, setRecepient] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgLink, setImgLink] = useState(null);
  const filePickerRef = useRef(null);

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
          snapshot.docs.forEach((docIns) => {
            updateDoc(
              doc(
                db,
                `users/${auth.currentUser.uid}/chats/${chatDetails.with}-chat/messages/`,
                docIns.id
              ),
              {
                isSeen: true,
              }
            );
          });
        }
      ),
    [chatDetails]
  );
  const sendMessage = async () => {
    const msg = message;
    setMessage("");

    const docRef = await addDoc(
      collection(
        db,
        `users/${auth.currentUser.uid}/chats/${chatDetails.with}-chat/messages`
      ),
      {
        message: msg,
        from: auth.currentUser.uid,
        to: chatDetails.with,
        timeSent: serverTimestamp(),
        isSeen: false,
      }
    );
    console.log("CHATID: ", docRef.id);
    if (selectedFile) {
      console.log("Sending attachment.");
      const imageRef = ref(storage, `chatImages/${docRef.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url").then(
        async (snapshot) => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(
            doc(
              db,
              `users/${auth.currentUser.uid}/chats/${chatDetails.with}-chat/messages`,
              docRef.id
            ),
            {
              image: downloadURL,
            }
          );
          setImgLink(downloadURL);
          setSelectedFile(null);
        }
      );
    }
    await setDoc(
      doc(
        db,
        `users/${auth.currentUser.uid}/chats`,
        `${chatDetails.with}-chat`
      ),
      {
        isSeen: false,
        recentMessage: msg,
        image: imgLink,
        timeSent: serverTimestamp(),
        with: chatDetails.with,
      }
    );
    await addDoc(collection(db, `users/${chatDetails.with}/notifications`), {
      isSeen: false,
      title: `New Message from ${auth.currentUser.displayName}`,
      body: msg,
      sentBy: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
    var data = JSON.stringify({
      "to": recipient.token,
      "notification": {
        "body": msg,
        "title": "Admin sent a message"
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
  const addFileToMsg = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
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
      : str.toDate().toLocaleString("en-US", {
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
        {recipient.profilePic !== "" ? (
          <Image
            src={recipient.profilePic}
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
        <div className="ml-3">{recipient.name}</div>
      </div>
      <div className="overflow-y-auto scrollbar h-[50vh]" id="chatscroll">
        {chatList.map((msg) => {
          return (
            <>
              <div
                className={`flex  my-1 ${
                  msg.data().from == chatDetails.with ? "" : "flex-row-reverse"
                }`}
              >
                <div className="relative cursor-pointer">
                  {msg.data().from == chatDetails.with ? (
                    recipient.profilePic !== "" ? (
                      <Image
                        src={recipient.profilePic}
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
                  ) : (
                    auth.currentUser.photoURL !== "" ? (
                      <Image
                        src={auth.currentUser.photoURL}
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
                  )}
                </div>
                <div
                  className={`h-fit flex flex-col mx-3 py-1 px-2 shadow-md min-w-[50px] max-w-md rounded-lg ${
                    msg.data().from
                      ? "rounded-tl-none bg-white"
                      : "rounded-tr-none bg-[#F3F3F3]"
                  }`}
                >
                  {msg.data().image ? (
                    <div className="bg-gray-200 rounded flex justify-center w-fit items-center mt-2 p-3 mb-2">
                      <Image
                        src={msg.data().image}
                        alt="profile"
                        height={250}
                        width={250}
                        className="h-10 cursor-pointer"
                      />
                    </div>
                  ) : null}
                  <div className="flex items-end justify-between w-full">
                    <div className="px-2 w-[90%] break-words">{msg.data().message}</div>
                    <div className="text-xs text-end min-w-fit">
                      {printDate(msg.data().timeSent)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
      <div className="mt-5 px-5 py-6 border border-gray-200 rounded-md flex bg-white">
        {selectedFile ? <p>File Selected</p> : null}
        <input
          type="text"
          className="bg-inherit w-full focus:outline-none"
          placeholder="Type Message ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <PaperClipIcon
          className="h-7 w-7 mr-3 text-gray-500 hover:text-black cursor-pointer"
          onClick={() => filePickerRef.current.click()}
        />
        <input ref={filePickerRef} onChange={addFileToMsg} type="file" hidden />
        <PaperAirplaneIcon
          className="h-7 w-7 mr-3 text-gray-500 hover:text-black cursor-pointer"
          onClick={() => sendMessage()}
        />
      </div>
    </div>
  );
}

export default OpenedMessage;

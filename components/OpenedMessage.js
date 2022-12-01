import React, { useEffect, useRef, useState } from "react";
import {
  FolderArrowDownIcon,
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

function OpenedMessage({ recipientId }) {
  const [message, setMessage] = useState("");
  const [recipient, setRecepient] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgLink, setImgLink] = useState(null);
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const filePickerRef = useRef(null);

  useEffect(() => {
    const userDoc = getDoc(doc(db, "users", recipientId)).then((docSnap) => {
      setRecepient(docSnap.data());
    });
  }, [recipientId]);
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(
            db,
            `users/${auth.currentUser.uid}/chats/${recipientId}-chat/messages`
          ),
          orderBy("timeSent")
        ),
        (snapshot) => {
          setChatList(snapshot.docs);
          snapshot.docs.forEach((docIns) => {
            updateDoc(
              doc(
                db,
                `users/${auth.currentUser.uid}/chats/${recipientId}-chat/messages/`,
                docIns.id
              ),
              {
                isSeen: true,
              }
            );
          });
        }
      ),
    [recipientId]
  );
  const sendMessage = async () => {
    const msg = message;
    setMessage("");

    const docRef = await addDoc(
      collection(
        db,
        `users/${auth.currentUser.uid}/chats/${recipientId}-chat/messages`
      ),
      {
        message: msg,
        from: auth.currentUser.uid,
        to: recipientId,
        timeSent: serverTimestamp(),
        isSeen: false,
      }
    );
    console.log("CHATID: ", docRef.id);
    if (selectedFile) {
      console.log("SELECTed file type", fileType);
      if (fileType.split("/")[0] === "image") {
        const imageRef = ref(storage, `chatImages/${fileName}`);
        await uploadString(imageRef, selectedFile, "data_url").then(
          async (snapshot) => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(
              doc(
                db,
                `users/${auth.currentUser.uid}/chats/${recipientId}-chat/messages`,
                docRef.id
              ),
              {
                image: downloadURL,
                file: "",
                fileName: fileName,
              }
            );
            setImgLink(downloadURL);
            setSelectedFile(null);
          }
        );
      } else {
        const imageRef = ref(storage, `chatImages/${fileName}`);
        await uploadString(imageRef, selectedFile, "data_url").then(
          async (snapshot) => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(
              doc(
                db,
                `users/${auth.currentUser.uid}/chats/${recipientId}-chat/messages`,
                docRef.id
              ),
              {
                image: "",
                file: downloadURL,
                fileName: fileName,
              }
            );
            setImgLink(downloadURL);
            setSelectedFile(null);
          }
        );
      }
    }
    await setDoc(
      doc(db, `users/${auth.currentUser.uid}/chats`, `${recipientId}-chat`),
      {
        isSeen: false,
        recentMessage: msg,
        image: imgLink,
        timeSent: serverTimestamp(),
        with: recipientId,
      }
    );
    await addDoc(collection(db, `users/${recipientId}/notifications`), {
      isSeen: false,
      title: `New Message from ${auth.currentUser.displayName}`,
      body: msg,
      sentBy: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
    var data = JSON.stringify({
      to: recipient.token,
      notification: {
        body: msg,
        title: "Admin sent a message",
      },
    });
    var config = {
      method: "post",
      url: "https://fcm.googleapis.com/fcm/send",
      headers: {
        Authorization:
          "Bearer AAAA7j_APoE:APA91bHYEq6k0otSNNtsrEvIaek_yNalzbo8ZGNN0QAe887_Xh8UV3FJdGCtOSTe2_u-OKal23aCyWJgcOHA7NGKYsnF3hC1zHbuiQ4HM5hmlNB8mgHAu4YDJ-p5uftZx4AyeTkZzXGa",
        "Content-Type": "application/json",
      },
      data: data,
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
    console.log("DSAADS", e.target.files[0].name);
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      setFileType(e.target.files[0].name.split(".")[1]);
      setFileName(e.target.files[0].name);
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
  const linkify = (text) => {
    var urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, function (url) {
      return (
        '<a href="' +
        url +
        '" class="text-blue-500 hover:underline" target="_blank">' +
        url +
        "</a>"
      );
    });
  };
  return (
    <div className="flex flex-col justify-end h-full mx-5">
      <div
        className="flex items-center shadow-b-md"
        style={{ boxShadow: "0px 3px 0px #f0f0f0" }}
      >
        {recipient?.profilePic !== "" ? (
          <Image
            src={recipient?.profilePic}
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
                  msg.data().from == recipientId ? "" : "flex-row-reverse"
                }`}
              >
                <div className="relative cursor-pointer">
                  {msg.data().from == recipientId ? (
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
                  ) : auth.currentUser.photoURL !== "" ? (
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
                        placeholder="blur"
                        blurDataURL="https://firebasestorage.googleapis.com/v0/b/taskmanagement-a5d8a.appspot.com/o/chatImages%2FHFrnXt6R05Pg3cnuhu5Z%2Fimage?alt=media&token=2bc9d319-a4a7-4334-9506-09015088515e"
                        height={250}
                        width={250}
                        className="h-10 cursor-pointer"
                      />
                    </div>
                  ) : null}
                  {msg.data().file ? (
                    <a
                      href={msg.data().file}
                      target="_blank"
                      className="bg-gray-200 rounded flex justify-center w-fit items-center mt-2 p-3 mb-2 hover:text-blue-700"
                      rel="noreferrer"
                    >
                      <FolderArrowDownIcon className="h-4 w-4" />
                      <span className="pl-2">
                        {msg.data().fileName
                          ? msg.data().fileName
                          : "Download File"}
                      </span>
                    </a>
                  ) : null}
                  <div className="flex items-end justify-between w-full">
                    <div
                      className="px-2 w-[90%] break-words"
                      dangerouslySetInnerHTML={{
                        __html: linkify(msg.data().message),
                      }}
                    ></div>
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

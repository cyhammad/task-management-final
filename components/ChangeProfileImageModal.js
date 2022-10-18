import { PencilIcon, PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { db, storage } from "../firebase";

function ChangeProfileImageModal() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errAlert, setErrAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);

  const addImageToProfile = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  const changeUserProfileImage = async () => {
    if (loading) return;
    setLoading(true);
    const imageRef = ref(storage, `profilePics/${user.uid}`);
    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "users", user.uid), {
          profilePic: downloadURL,
        });
        updateProfile(user, {
            photoURL: downloadURL,
        }).then(
            ()=>{
                setShowModal(false);
                setLoading(false);
                setSelectedFile(null);
            }
        ).catch(
            (err)=> setErrAlert("Failed to upload Profile Picture")
        )
      }
    );

  };
  return (
    <>
      <div
        className="flex justify-between py-6 border-b border-gray-200 hover:text-black cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <p>Change Profile Picture</p>
        <PencilIcon className="h-6 w-6" />
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-4xl lg:min-w-[600px]">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between border-b border-solid">
                  <div className="flex items-start justify-between py-6 pl-10 border-b border-solid border-slate-200 rounded-t grow">
                    <h3 className="text-xl font-semibold pt-1">
                      Change Profile Picture
                    </h3>
                  </div>
                  <button
                    className="w-4 h-4 bg-slate-700 flex justify-center items-center text-white rounded-full text-[9px] m-2"
                    onClick={() => setShowModal(false)}
                  >
                    x
                  </button>
                </div>
                {/*body*/}
                <div className="flex justify-center items-center pt-8">
                  {selectedFile ? (
                    <Image
                      className="cursor-pointer rounded-lg"
                      src={selectedFile}
                      height={100}
                      width={100}
                      alt="selected image"
                    />
                  ) : (
                    <div className="bg-blue-50 p-8 flex justify-center items-center rounded-xl">
                      <div
                        onClick={() => filePickerRef.current.click()}
                        className="bg-[#004064] flex justify-center items-center text-white px-2 py-2 rounded-lg cursor-pointer"
                      >
                        <PlusIcon className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={filePickerRef}
                  onChange={addImageToProfile}
                  type="file"
                  hidden
                />
                <div className="flex flex-col items-center  justify-center pt-3">
                  <p className="font-medium">Upload Profile Pic</p>
                  <p className="text-xs text-gray-500">Upload a picture from your gallery</p>
                </div>
                {/*footer*/}
                {errAlert != "" ? (
                  <>
                    <div className="bg-red-400 text-white w-56 mt-2 self-center px-3 rounded text-xs py-2 flex justify-between">
                      <p>{errAlert}</p>
                      <XCircleIcon
                        className="w-5 h-5"
                        onClick={() => setErrAlert("")}
                      />
                    </div>
                  </>
                ) : null}
                <div className="flex flex-col justify-center items-center space-y-5 mt-5 mb-16 px-10">
                  <button
                    className="bg-[#004064] rounded-md text-white w-56 py-3 text-xs"
                    onClick={changeUserProfileImage}
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default ChangeProfileImageModal;

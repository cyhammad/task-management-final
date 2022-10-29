import React, { useRef, useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  PhoneIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

function AddUserModal() {
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [data, setData] = useState({
    displayName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await signup(
        data.displayName,
        data.email,
        data.password,
        data.phoneNumber
      ).then(async () => {
        const docRef = doc(db, "users", auth.currentUser.uid);
        console.log("doc: ", docRef.id);
        if (selectedFile == null) {
          const imageRef = ref(storage, `profilePics/defaultProfilePic.png`);
          const defaultIMG = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "users", docRef.id), {
            profilePic: defaultIMG,
          });
          updateProfile(auth.currentUser, {
            displayName: data.displayName,
            photoURL: defaultIMG,
          });
        } else {
          const imageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
          await uploadString(imageRef, selectedFile, "data_url").then(
            async (snapshot) => {
              const downloadURL = await getDownloadURL(imageRef);
              await updateDoc(doc(db, "users", docRef.id), {
                profilePic: downloadURL,
              });
              updateProfile(auth.currentUser, {
                displayName: data.displayName,
                photoURL: downloadURL,
              });
            }
          );
        }
      });

      router.push("/");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const addImageToProfile = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  return (
    <>
      <button
        className="text-white bg-[#004064] py-[6px] pl-2 pr-3 text-xs rounded flex items-center gap-x-1 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <UserPlusIcon className="h-4 w-4" />
        Add User
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-4xl lg:min-w-[600px]">
              {/*content*/}
              <div className="bg-white p-10 rounded-md">
                <button
                  className="w-4 h-4 bg-slate-700 flex justify-center items-center text-white rounded-full text-[9px] m-2 float-right"
                  onClick={() => setShowModal(false)}
                >
                  x
                </button>
                <form onSubmit={handleSignup}>
                  <input
                    ref={filePickerRef}
                    onChange={addImageToProfile}
                    type="file"
                    hidden
                  />
                  <div className="flex justify-center items-center py-2">
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
                  <div className="flex flex-col items-center  justify-center pb-3">
                    <p className="font-medium">Upload Profile Picture</p>
                    <p className="text-xs text-gray-500">
                      Select a profile picture from your device
                    </p>
                  </div>
                  <div className="shadow-md flex justify-center items-center p-5 bg-white rounded mb-4">
                    <UserIcon className="w-6 h-6 text-gray-500" />
                    <input
                      value={data.displayName}
                      className="focus:outline-none pl-4 w-full"
                      type="text"
                      name="displayName"
                      id="displayName"
                      placeholder="Name    "
                      onChange={(e) =>
                        setData({ ...data, displayName: e.target.value })
                      }
                    />
                  </div>
                  <div className="shadow-md flex justify-center items-center p-5 bg-white rounded mb-4">
                    <EnvelopeIcon className="w-6 h-6 text-gray-500" />
                    <input
                      value={data.email}
                      className="focus:outline-none pl-4 w-full"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="shadow-md flex justify-center items-center p-5 bg-white rounded mb-4">
                    <PhoneIcon className="w-6 h-6 text-gray-500" />
                    <input
                      value={data.phoneNumber}
                      className="focus:outline-none pl-4 w-full"
                      type="phoneNumber"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="Phone Number"
                      onChange={(e) =>
                        setData({ ...data, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="shadow-md flex justify-center items-center p-5 bg-white rounded">
                    <LockClosedIcon className="w-6 h-6 text-gray-500" />
                    <input
                      value={data.password}
                      className="focus:outline-none pl-4 w-full"
                      type={showPass ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="Password"
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                    />
                    {showPass ? (
                      <EyeIcon
                        className="w-6 h-6 text-gray-500 hover:text-black cursor-pointer"
                        onClick={() => setShowPass(false)}
                      />
                    ) : (
                      <EyeSlashIcon
                        className="w-6 h-6 text-gray-500 hover:text-black cursor-pointer"
                        onClick={() => setShowPass(true)}
                      />
                    )}
                  </div>
                  <input
                    className="shadow-md flex justify-center items-center p-5 bg-[#004064] rounded mt-7 cursor-pointer text-white w-full"
                    type="submit"
                    value={loading ? "Creating Account..." : "Sign Up"}
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default AddUserModal;

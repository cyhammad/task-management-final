import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { db } from "../firebase";

function ChangeEmailModal() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errAlert, setErrAlert] = useState("");
  const emailRef = useRef(null);
  const userNameRef = useRef(null);
  const passRef = useRef(null);

  const changeUserCreds = () => {
    if (loading) return;
    console.log("Pass REF: ", passRef.current.value);
    if (passRef != null && passRef?.current.value != "") {
      if (userNameRef?.current.value == "" && emailRef?.current.value == "") {
        setErrAlert("Please fill 1 of the above fields");
      } else if (userNameRef?.current.value == "") {
        setLoading(true);
        const credentials = EmailAuthProvider.credential(
          user.email,
          passRef.current.value
        );
        reauthenticateWithCredential(user, credentials)
          .then(() => {
            console.log("Reauthenticate Successful");
            if (emailRef?.current.value != "") {
              updateEmail(user, emailRef.current.value)
                .then(async () => {
                  await updateDoc(doc(db, "users", user.uid), {
                    email: emailRef.current.value,
                  }).then(() => {
                    setLoading(false);
                    setShowModal(false);
                  });
                })
                .catch((err) =>
                  setErrAlert("Error occured while updating email.", err)
                );
            }
          })
          .catch((error) => {
            setErrAlert("Reauthenticating Error", error);
            setLoading(false);
          });
      } else if (emailRef?.current.value == "") {
        setLoading(true);
        const credentials = EmailAuthProvider.credential(
          user.email,
          passRef.current.value
        );
        reauthenticateWithCredential(user, credentials)
          .then(() => {
            console.log("Reauthenticate Successful");
            if (userNameRef?.current.value != "") {
              updateProfile(user, {
                displayName: userNameRef.current.value,
              })
                .then(async () => {
                  await updateDoc(doc(db, "users", user.uid), {
                    name: userNameRef.current.value,
                  });
                  setLoading(false);
                  setShowModal(false);
                })
                .catch((err) => {
                  setErrAlert("Error occured while updating username.", err);
                  setLoading(false);
                });
            }
          })
          .catch((error) => {
            setErrAlert("Reauthenticating Error", error);
            setLoading(false);
          });
      } else {
        setLoading(true);
        const credentials = EmailAuthProvider.credential(
          user.email,
          passRef.current.value
        );
        reauthenticateWithCredential(user, credentials)
          .then(() => {
            console.log("Reauthenticate Successful");
            if (userNameRef?.current.value != "") {
              updateProfile(user, {
                displayName: userNameRef.current.value,
              })
                .then(async () => {
                  await updateDoc(doc(db, "users", user.uid), {
                    name: userNameRef.current.value,
                  });
                })
                .catch((err) => {
                  setErrAlert("Error occured while updating username.", err);
                  setLoading(false);
                });
            }
            if (emailRef?.current.value != "") {
              updateEmail(user, emailRef.current.value)
                .then(async () => {
                  await updateDoc(doc(db, "users", user.uid), {
                    email: emailRef.current.value,
                  }).then(() => {
                    setLoading(false);
                    setShowModal(false);
                  });
                })
                .catch((err) =>
                  setErrAlert("Error occured while updating email.", err)
                );
            }
          })
          .catch((error) => {
            setErrAlert("Reauthenticating Error", error);
            setLoading(false);
          });
      }
    } else {
      setErrAlert("Password Field cannot be empty.");
    }
  };
  return (
    <>
      <div
        className="flex justify-between py-6 border-b border-gray-200 hover:text-black cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <p>Change Email / Username</p>
        <UserIcon className="h-6 w-6" />
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
                      Change Email / Username
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
                <div className="flex self-center justify-center items-center px-3 mt-10 w-fit bg-white rounded border-2 focus-within:border-black">
                  <input
                    ref={userNameRef}
                    type="text"
                    name="newusername"
                    id="newusername"
                    className="rounded-md w-44 p-3 text-xs focus:outline-none"
                    placeholder="New Username"
                    onChange={() => setErrAlert("")}
                  />
                  <UserIcon className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex self-center justify-center items-center px-3 mb-4 mt-5 w-fit bg-white rounded border-2 focus-within:border-black">
                  <input
                    ref={emailRef}
                    type="text"
                    name="newemail"
                    id="newemail"
                    className="rounded-md w-44 p-3 text-xs focus:outline-none"
                    placeholder="New Email"
                    onChange={() => setErrAlert("")}
                  />
                  <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-center text-xs w-72 text-gray-400 mb-3 self-center">
                  Password is required to change credentials
                </p>
                <div className="flex self-center justify-center items-center px-3 mb-3 w-fit bg-white rounded border-2 focus-within:border-black">
                  <input
                    ref={passRef}
                    type={showPass ? "text" : "password"}
                    name="pass"
                    id="pass"
                    className="rounded-md w-44 p-3 text-xs focus:outline-none"
                    placeholder="Password"
                    onChange={() => setErrAlert("")}
                  />
                  {showPass ? (
                    <EyeIcon
                      className="w-4 h-4 text-gray-500 hover:text-black cursor-pointer"
                      onClick={() => setShowPass(false)}
                    />
                  ) : (
                    <EyeSlashIcon
                      className="w-4 h-4 text-gray-500 hover:text-black cursor-pointer"
                      onClick={() => setShowPass(true)}
                    />
                  )}
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
                <div className="flex flex-col justify-center items-center space-y-5 mt-2 mb-10 px-10">
                  <button
                    className="bg-[#004064] rounded-md text-white w-56 py-3 text-xs"
                    onClick={changeUserCreds}
                  >
                    {loading ? "Updating User..." : "Update User Details"}
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

export default ChangeEmailModal;

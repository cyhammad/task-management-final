import { EyeIcon, EyeSlashIcon, LockClosedIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import React, { useRef, useState } from "react";

function ChangePasswordModal() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [showModal, setShowModal] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errAlert, setErrAlert] = useState("");
  const newPassRef = useRef(null);
  const oldPassRef = useRef(null);
  const changePassword = () => {
    if (oldPassRef?.current.value == "" || newPassRef?.current.value == ""){
      setErrAlert("Fields cannot be empty")
    }
    else{
      if (oldPassRef?.current.value == newPassRef?.current.value){
        setErrAlert("New password cannot be same as old password")
      }
      else{
        setLoading(true);
        if (loading) return;
        console.log(user);
        const credentials = EmailAuthProvider.credential(
          user.email,
          oldPassRef.current.value,
        )
        reauthenticateWithCredential(user, credentials).then(
          ()=>{
            console.log("Reauthenticate Successful")
            updatePassword(user, newPassRef.current.value).then(
              ()=>{
                console.log("Successfully Updated Password!")
                setLoading(false);
                setShowModal(false);
              }
            ).catch(
              (error)=>{
                setErrAlert("Something went wrong please try again.")
                setLoading(false);
              }
            )
          }
        ).catch(
          (error)=>{
            setErrAlert("Invalid old password.")
            setLoading(false);
          }
        )
      }
    }
  };
  return (
    <>
      <div
        className="flex justify-between py-6 border-b border-gray-200 hover:text-black cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <p>Change Password</p>
        <LockClosedIcon className="h-6 w-6" />
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
                      Change Password
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
                    ref={oldPassRef}
                    type={showPass ? "text" : "password"}
                    name="oldpassword"
                    id="oldpassword"
                    className="rounded-md w-44 p-3 text-xs focus:outline-none"
                    placeholder="Old Password"
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
                <div className="flex self-center justify-center items-center px-3 mb-4 mt-5 w-fit bg-white rounded border-2 focus-within:border-black">
                  <input
                    ref={newPassRef}
                    type={showPass ? "text" : "password"}
                    name="newpassword"
                    id="newpassword"
                    className="rounded-md w-44 p-3 text-xs focus:outline-none"
                    placeholder="New Password"
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
                <div className="flex flex-col justify-center items-center space-y-5 mt-5 mb-10 px-10">
                  <button
                    className="bg-[#004064] rounded-md text-white w-56 py-3 text-xs"
                    onClick={changePassword}
                  >
                    {loading ? "Updating Password..." : "Update Password"}
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

export default ChangePasswordModal;

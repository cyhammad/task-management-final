import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { filterbySearch } from "../utility/filter";

function SearchModal() {
  const [showModal, setShowModal] = useState(false);
  const [errAlert, setErrAlert] = useState("");
  const [searchStr, setSearchStr] = useState("")
  const [resultlist, setResultlist] = useState([]);
  const router = useRouter();
  useEffect(
      ()=>{
          const searchlist = ["Projects", "Quick Tasks", "Chats", "Users" ,"Settings", "Change Password", "Change Username", "Change Email", "Change Profile Pic", "Work"];
          setResultlist(searchlist.filter((item)=>item.toLowerCase().startsWith(searchStr.toLowerCase())))
    }, [searchStr]
  )
  const navigatePage = (item) => {
    if (item == "Projects" || item == "Work"){
        router.push("/")
    }
    else if (item == "Quick Tasks"){
        router.push("/quicktasks")
    }
    else if (item == "Chats"){
        router.push("/chats")
    }
    else if (item == "Settings" || item == "Change Password" || item == "Change Username" || item == "Change Email" || item == "Change Profile Pic"){
        router.push("/settings")
    }
    setShowModal(false);
  }
  console.log(resultlist)
  return (
    <>
      <div
        className="flex justify-between py-6 border-b border-gray-200 hover:text-black cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <MagnifyingGlassIcon
          className="navBtn"
        />
      </div>

      {showModal ? (
        <div className="p-0 m-0">
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none" >
            <div className="relative w-auto my-6 mx-auto max-w-4xl lg:min-w-[600px]">
              {/*content*/}
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between border-b border-solid">
                  <div className="flex items-start justify-between py-6 pl-10 border-b border-solid border-slate-200 rounded-t grow">
                    <h3 className="text-xl font-medium pt-1">Search</h3>
                  </div>
                  <button
                    className="w-4 h-4 bg-slate-700 flex justify-center items-center text-white rounded-full text-[9px] m-2"
                    onClick={() => setShowModal(false)}
                  >
                    x
                  </button>
                </div>
                {/*body*/}
                <div className="flex self-center justify-between items-center px-3 mt-3 w-[95%] bg-white rounded border-2 focus-within:border-black">
                  <input
                    type="text"
                    name="newusername"
                    id="newusername"
                    className="rounded-md w-full p-3 text-xs focus:outline-none"
                    placeholder="Type to search..."
                    onChange={(e) => {
                        setErrAlert("")
                        setSearchStr(e.target.value);
                    }}
                    value={searchStr}
                  />
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
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
                <div className="flex flex-col justify-center items-center space-y-2 mt-5 mb-16 px-10">
                {resultlist.map(
                    (item) => (
                        <button className="hover:bg-gray-200 px-10 py-2 w-full" key={resultlist.indexOf(item)} onClick={()=>navigatePage(item)} >{item}</button>
                    )
                )}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
      ) : null}
    </>
  );
}

export default SearchModal;

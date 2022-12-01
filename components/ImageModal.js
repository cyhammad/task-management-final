import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useState } from "react";

function ImageModal({ msg }) {
  const [show, setShow] = useState(false);
  return (
    <div className="bg-gray-200 rounded flex justify-center w-fit items-center mt-2 p-3 mb-2">
      <Image
        src={msg.data().image}
        alt="profile"
        placeholder="blur"
        blurDataURL="https://firebasestorage.googleapis.com/v0/b/taskmanagement-a5d8a.appspot.com/o/chatImages%2FHFrnXt6R05Pg3cnuhu5Z%2Fimage?alt=media&token=2bc9d319-a4a7-4334-9506-09015088515e"
        height={250}
        width={250}
        onClick={() => setShow(true)}
        className="h-10 cursor-pointer"
      />
      {show ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-md p-3">
            <div className="flex justify-between">
              <div className="p-2 cursor-pointer bg-slate-200">
                <a href={msg.data().image} target='_blank' rel="noreferrer"><ArrowDownIcon className="h-5 w-5" /></a>
              </div>
              <div className="cursor-pointer bg-black text-white rounded-full h-fit p-1" onClick={() => setShow(false)}>
                <XMarkIcon className="h-3 w-3" />
              </div>
            </div>
            <Image
              src={msg.data().image}
              alt="profile"
              placeholder="blur"
              blurDataURL="https://firebasestorage.googleapis.com/v0/b/taskmanagement-a5d8a.appspot.com/o/chatImages%2FHFrnXt6R05Pg3cnuhu5Z%2Fimage
                    ?alt=media&token=2bc9d319-a4a7-4334-9506-09015088515e"
              height={500}
              width={500}
              className="h-10 cursor-pointer"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ImageModal;

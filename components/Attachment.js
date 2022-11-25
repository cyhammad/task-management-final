import {
  DocumentTextIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import Link from "next/link";

function Attachment({ attachment }) {
  const [options, setOptions] = useState(false);
  const [downloadLink, setDownloadLink] = useState(null);
  const handleDownload = () => {
    console.log("download");
    getDownloadURL(ref(storage, attachment.fileUrl)).then((url) => {
      setDownloadLink(url);
    });
  };
  return (
    <Link href={attachment.fileUrl}>
      <div
        className="flex flex-col items-center justify-center mb-3 mr-4 max-w-[20%] cursor-pointer"
        key={attachment.fileName}
      >
        <div className="flex items-center justify-center space-x-2 bg-[#F4F5F8] p-3">
          <div className="h-10 w-10 flex justify-center items-center cursor-pointer">
            <DocumentTextIcon className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex flex-col pr-3">
            <p className="text-sm font-medium">
              {attachment.fileName.slice(0, 10)}
              {attachment.fileName.length > 10 ? "..." : null}
            </p>
            <p className="text-xs text-gray-500">{attachment.size}</p>
          </div>
          {/* <EllipsisHorizontalIcon className="h-5 w-5" onClick={()=>setOptions(!options)} /> */}
        </div>
        {/* {options && (
            <div className="top-16 flex flex-col w-[155px] rounded bg-[#282828] text-white">
                <div className="">
                    Delete
                </div>
                <div>
                    Download
                </div>
            </div>
        )} */}
      </div>
    </Link>
  );
}

export default Attachment;

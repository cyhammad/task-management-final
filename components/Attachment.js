import { DocumentTextIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import React, {useState} from "react";

function Attachment({attachment}) {
    const [options, setOptions] = useState(false);
  return (
    <div
      className="flex flex-col items-center justify-center space-y-5 mr-4 max-w-[20%]"
      key={attachment.fileName}
    >
      <div className="flex items-center justify-center space-x-2 bg-[#F4F5F8] p-3">
        <div className="h-10 w-10 flex justify-center items-center cursor-pointer">
          <DocumentTextIcon className="h-6 w-6 text-red-500" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{attachment.fileName.slice(0,12)}{attachment.fileName.length > 12 ? "...": null}</p>
          <p className="text-xs text-gray-500">{attachment.size}</p>
        </div>
        <EllipsisHorizontalIcon className="h-5 w-5" onClick={()=>setOptions(!options)} />
      </div>
        {options && (
            <div className="top-16 flex flex-col w-[155px] rounded bg-[#282828]">
                <div className="">
                    Delete
                </div>
                <div>
                    Download
                </div>
            </div>
        )}
    </div>
  );
}

export default Attachment;

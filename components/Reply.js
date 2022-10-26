import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

function Reply({ reply }) {
  const [replier, setReplier] = useState(null);

  useEffect(() => {
    if (reply.data().addedBy != undefined) {
      const docRef = doc(db, "users", reply.data().addedBy);
      getDoc(docRef).then((docSnap) => {
        setReplier(docSnap.data());
      });
    }
  });
  return (
    <div className="flex pt-4 w-full">
      <div className="h-10">
        <Image
          src={replier?.profilePic}
          alt="profile"
          height={40}
          width={40}
          className="cursor-pointer rounded-full"
        />
      </div>
      <div className="flex flex-col pl-3 w-full">
        <div className="flex items-center">
          <p className="font-medium">{replier?.name}</p>
        </div>
        <div className="flex">
          <p className="text-sm text-gray-600">{reply.data().reply}</p>
        </div>
        <div className="flex pt-2">
          <div className="flex  w-full text-xs text-[#004064]">
            <HandThumbUpIcon className="h-4 w-4" />
            <p className="pl-1">{reply.data().likedBy?.length} Like</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reply;

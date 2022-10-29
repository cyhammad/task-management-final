import React, { useEffect, useState } from "react";
import CommentsModal from "./CommentsModal";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import TaskOptions from "./TaskOptions";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "react-toastify";
import ProjectOptions from "./ProjectOptions";

function Project(props) {
  const [userPic, setUserPic] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (props.userId != undefined) {
      const docRef = doc(db, "users", props.userId);
      getDoc(docRef).then((docSnap) => {
        setUserPic(docSnap.data().profilePic);
      });
    }
  }, [props.userId]);
  const navigateTasks = () => {
    if (props.taskNumber == 0){
      toast("No tasks in this project")
    }
    else{
      router.push(`/projecttasks/${props.userId}/${props.projectId}`)
    }
  }
  return (
    <div>
      <div className="px-5 pt-5 pb-1 bg-white m-3 rounded-xl w-auto mb-3">
        <div className="cursor-pointer">
          <div className="flex justify-between items-center pb-4 cursor-pointer" onClick={()=>navigateTasks()}>
            <div className="flex space-x-2 items-center">
              <div className=" rounded-md bg-white">
              <Image
                src={userPic}
                width={40}
                height={40}
                className="rounded-full"
                alt="user"
              />
              </div>
              <h1>{props.name}</h1>
            </div>
            <span
              className={
                props.priority == "High"
                  ? "rounded-md text-white px-2 text-xs py-1 bg-red-500"
                  : props.priority == "Mid"
                  ? "rounded-md text-white px-2 text-xs py-1 bg-yellow-500"
                  : "rounded-md text-white px-2 text-xs py-1 bg-blue-500"
              }
            >
              {props.priority != null ? props.priority : "Low"}
            </span>
          </div>
          <div className="text-gray-400 pb-4">{props.desc}</div>
          <CommentsModal projectId={props.projectId} userId={props.userId} taskType={'project'} />
          <div
            className={
              props.taskNumber == undefined && props.remainingTime == undefined
                ? "hidden"
                : "flex justify-between py-4"
            }
            onClick={()=>navigateTasks()}
          >
            <span
              className={
                props.taskNumber == undefined
                  ? "opacity-0"
                  : "rounded-md bg-gray-700 text-white px-3 text-xs py-[4px] cursor-pointer"
              }
            >
              {props.taskNumber} task
            </span>
            <span
              className={
                props.remainingTime == undefined
                  ? "opacity-0"
                  : "rounded-sm bg-gray-200 text-gray-500 px-1 text-xs py-[2px] cursor-pointer"
              }
            >
              Est. {props.remainingTime}
            </span>
          </div>
        </div>

        <ProjectOptions userId={props.userId} projectId={props.projectId} taskNumber={props.taskNumber} />
      </div>
    </div>
  );
}

export default Project;

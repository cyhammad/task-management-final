import React, { useEffect, useState } from "react";
import faker from "@faker-js/faker";
import Task from "./Task";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

function TaskColumn(props) {
  const [allVisible, setAllVisible] = useState(false);
  const handleViewMore = () => {
    props.viewMore()
    setAllVisible(true);
  }
  return (
    <div className="bg-gradient-to-b from-[#F4F5F8] to-slate-50 pt-7 w-fit mt-5 rounded-md min-w-full sm:min-w-[50vw] md:min-w-[35vw] lg:min-w-[25vw] 2xl:min-w-[22vw] lg:min-h-[70vh]">
      <div className="flex justify-between items-center px-5 font-medium">
        <h1 className="flex items-center">
          {props.name}
          <div
            className={
              props.nCount == undefined
                ? "opacity-0"
                : "w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-xs text-white ml-3"
            }
          >
            {props.nCount}
          </div>
        </h1>
        {props.taskCount > 3 && !allVisible ? <button className="text-xs" onClick={()=>handleViewMore()}>View all</button>: null}
      </div>
      {props.children}
      {props.taskCount > 3 && !allVisible ? (
        <div className="flex flex-col items-center text-xs text-gray-600 pb-5 mb-5 cursor-pointer" onClick={()=>handleViewMore()}>
          <ChevronUpIcon className="w-5 h-5" />
          View more
        </div>
      ) : null}
    </div>
  );
}

export default TaskColumn;

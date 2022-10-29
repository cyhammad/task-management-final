import React, { useEffect, useState } from "react";
import faker from "@faker-js/faker";
import Task from "./Task";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

function Column({ viewMore, viewLess, name, nCount, taskCount, children }) {
  const [allVisible, setAllVisible] = useState(false);
  const handleViewMore = () => {
    viewMore();
    setAllVisible(true);
  };
  const handleViewLess = () => {
    viewLess();
    setAllVisible(false);
  };
  return (
    <div className="bg-gradient-to-b from-[#F4F5F8] to-slate-50 pt-7 w-fit mt-5 rounded-md min-w-full sm:min-w-[50vw] md:min-w-[35vw] lg:min-w-[25vw] 2xl:min-w-[22vw] lg:min-h-[70vh]">
      <div className="flex justify-between items-center px-5 font-medium">
        <h1 className="flex items-center">
          {name}
          <div
            className={
              nCount == undefined
                ? "opacity-0"
                : "w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-xs text-white ml-3"
            }
          >
            {nCount}
          </div>
        </h1>
        {taskCount > 3 && !allVisible ? (
          <button className="text-xs" onClick={() => handleViewMore()}>
            View all
          </button>
        ) : null}
      </div>
      {children.length > 0 ? children : (<p className="text-center p-5 text-gray-300">No tasks</p>)}
      {taskCount > 3 && !allVisible ? (
        <div
          className="flex flex-col items-center text-xs text-gray-600 pb-5 mb-5 cursor-pointer"
          onClick={() => handleViewMore()}
        >
          <ChevronUpIcon className="w-5 h-5" />
          View more
        </div>
      ) : null}
      {taskCount == children.length && children.length > 3 ? (
        <div
          className="flex flex-col items-center text-xs text-gray-600 pb-5 mb-5 cursor-pointer"
          onClick={() => handleViewLess()}
        >
          <ChevronUpIcon className="w-5 h-5" />
          View less
        </div>
      ) : null}
    </div>
  );
}

export default Column;

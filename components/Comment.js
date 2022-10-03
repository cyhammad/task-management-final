import React from "react";
import {
    ArrowUturnLeftIcon,
  } from "@heroicons/react/24/outline";
import {
    HandThumbUpIcon
  } from "@heroicons/react/24/solid";


function Comment(props) {

  return (
    <div>
      <div
        className="flex space-x-5 items-center cursor-pointer mx-12 pt-5"
      >
        <div className=" rounded-md bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={props.profileImage}
            alt="profile"
            className="h-10 cursor-pointer rounded-full"
          />
        </div>
        <div>
          <h1 className="font-medium">Beyond Solution</h1>
          <p className="text-xs text-gray-500 pt-1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit
          </p>
        </div>
      </div>
      <div className="flex space-x-1 items-center mx-28 mt-2">
        <ArrowUturnLeftIcon className="w-3 h-3" />
        <p className="text-[10px]">Reply</p>
        <HandThumbUpIcon className="w-3 h-3 text-blue-500" />
        <p className="text-[10px]">1 Like</p>
      </div>
      <div
        className="flex space-x-5 items-center cursor-pointer mx-20 pt-5"
        onClick={() => setShowModal(true)}
      >
        <div className=" rounded-md bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={props.profileImage}
            alt="profile"
            className="h-10 cursor-pointer rounded-full"
          />
        </div>
        <div>
          <h1 className="font-medium">Beyond Solution</h1>
          <p className="text-xs text-gray-500 pt-1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit
          </p>
        </div>
      </div>
      <div className="flex space-x-1 items-center mx-36 mt-2">
        <ArrowUturnLeftIcon className="w-3 h-3" />
        <p className="text-[10px]">Reply</p>
        <HandThumbUpIcon className="w-3 h-3 text-blue-500" />
        <p className="text-[10px]">1 Like</p>
      </div>
      <div
        className="flex space-x-5 items-center cursor-pointer mx-20 pt-5"
        onClick={() => setShowModal(true)}
      >
        <div className=" rounded-md bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={props.profileImage}
            alt="profile"
            className="h-10 cursor-pointer rounded-full"
          />
        </div>
        <div>
          <h1 className="font-medium">Beyond Solution</h1>
          <p className="text-xs text-gray-500 pt-1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit
          </p>
        </div>
      </div>
      <div className="flex space-x-1 items-center mx-36 mt-2">
        <ArrowUturnLeftIcon className="w-3 h-3" />
        <p className="text-[10px]">Reply</p>
        <HandThumbUpIcon className="w-3 h-3 text-blue-500" />
        <p className="text-[10px]">1 Like</p>
      </div>
    </div>
  );
}

export default Comment;

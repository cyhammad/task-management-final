import React from 'react';
import { faker } from "@faker-js/faker";
import {
  EllipsisHorizontalIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import TaskModal from './TaskModal';
import CommentsModal from './CommentsModal';
import TaskOptions from './TaskOptions';

// Tasks = {
//   id : 01,
//   title: "Tasks",
//   subtitle: "A task of web development",
//   description: "Tasks",
//   priority: "High",
//   dueDate: "20 dec 2022",
//   status: "Assigned",
//   attachments: ["file", "file2"],
//   comments: [
//       {
//          userEmail: "user@example.com",
//          content: "I will be working",
//          likes: 4,
//          replies: [
//             {  userEmail: "user@example.com",
//                content: "I will be working",
//                likes: 4, },          
//             {  userEmail: "user@example.com",
//                content: "I will be working",
//                likes: 4, },          
//          ]  
//    ]
// }

function Task({task}) {
  
  return (
    <div className='px-5 pt-5 pb-1 bg-white m-3 rounded-xl w-auto mb-3'>
      <TaskModal task={task.title == undefined ? task.data(): task} />
      {/* <CommentsModal commentCount={props.commentCount} profileImage={faker.image.avatar()} />
      <div className={props.taskStatus == undefined && props.remainingTime == undefined ? "hidden": "flex justify-between pb-4"}>
        <span className={props.taskStatus == undefined ? "opacity-0": "rounded-md bg-[#656565] text-white px-3 text-xs py-[4px] cursor-pointer"}>
          {props.taskStatus}
        </span>
        <span className={props.remainingTime == undefined ? "opacity-0": "rounded-sm bg-gray-200 text-gray-500 px-1 text-xs py-[2px] cursor-pointer"}>
          Est. {props.remainingTime}
        </span>
      </div> */}
      <TaskOptions task={task.title == undefined ? task.data(): task} />
    </div>
  )
}

export default Task

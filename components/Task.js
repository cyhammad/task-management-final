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
      
    </div>
  )
}

export default Task

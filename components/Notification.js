import { BellIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";

function Notification({ notif }) {
  console.log("NOTif", notif.data());
  return (
    <Link href={notif?.data().title.includes("message") ? `/chats/${notif.data().sentBy}`: notif?.data().body.includes("project") ? `/projects` : notif?.data().body.includes("task") ? `/quicktasks`: '#'}>
      <div className="py-6 px-2 border-b flex items-center cursor-pointer hover:bg-slate-200">
        {notif.type == "" || notif.type == undefined ? (
          <BellIcon className="h-5 w-5 mr-4 text-blue-500" />
        ) : (
          <EnvelopeIcon className="h-5 w-5 mr-4" />
        )}
        <div key={notif.id}>
          <span className="font-medium">{notif.data().title}</span>{" "}
          <span className="text-gray-400 pl-3 text-sm">
            {notif.data().body}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default Notification;

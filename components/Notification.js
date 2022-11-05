import { BellIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import React from 'react'

function Notification({notif}) {
  return (
    <div className="py-6 border-b flex items-center">
        {notif.type == "" || notif.type == undefined ? (
            <BellIcon className="h-5 w-5 mr-4 text-blue-500" />
        ) : (
            <EnvelopeIcon className="h-5 w-5 mr-4" />
        )}
        <div key={notif.id}><span className="font-medium">{notif.data().title}</span> <span className="text-gray-400 pl-3 text-sm">{notif.data().body}</span></div>
    </div>
  )
}

export default Notification;
import React, { useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import {
  LockClosedIcon,
  UserIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import ChangeEmailModal from "../../components/ChangeEmailModal";
import ChangeProfileImageModal from "../../components/ChangeProfileImageModal";
import Link from "next/link";

function Settings() {

    const [passModal, setPassModal] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
  return (
    <div className="bg-default">
      <Head>
        <title>Task Management | Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Header selectedTab="settings" />

      {/* Tasks */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 min-h-screen">
        <h1 className="text-3xl font-semibold mt-11">Settings</h1>
        <div className="px-6 border-y border-gray-200 mt-5">
          <p className="font-medium text-lg mt-5 pb-4">Security</p>
        </div>
        <div className="px-6 text-gray-500">
          <ChangePasswordModal />
          <ChangeEmailModal />
        </div>
        <div className="px-6 border-y border-gray-200 mt-5 hover:text-black cursor-pointer">
          <p className="font-medium text-lg mt-5 pb-4">General</p>
        </div>
        <div className="px-6 text-gray-500">
          <Link href="/notifications">
            <div className="flex justify-between py-6 border-b border-gray-200 hover:text-black cursor-pointer">
              <p>Notfication</p>
              <BellAlertIcon className="h-6 w-6" />
            </div>
          </Link>
          <ChangeProfileImageModal />
        </div>
      </div>
    </div>
  );
}

export default Settings;

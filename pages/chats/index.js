import Head from "next/head";
import Image from "next/image";
import Header from "../../components/Header";
import SubNavBar from "../../components/SubNavBar";
import { faker } from "@faker-js/faker";
import OpenedMessage from "../../components/OpenedMessage";
import Chat from "../../components/Chat";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import StartChatModal from "../../components/StartChatModal";
import { useEffect, useState } from "react";

import React from "react";
import ChatLayout from "../../components/ChatLayout";

function Chats() {
  return (
    <div className="bg-default">
      <Head>
        <title>Task Management | Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header selectedTab="work" />
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 min-h-[75vh] lg:min-h-[85vh] pb-20">
        <h1 className="text-3xl font-semibold mt-11">Chats</h1>
        <SubNavBar selectedTab="chats" />
        <div className="lg:grid lg:grid-cols-4 lg:gap-4 mt-5 flex flex-col">
          <ChatLayout />
          <div className="bg-[#F4F5F8] rounded-lg col-span-3 py-5 px-3 min-h-[70vh]">
            <div className="text-center text-gray-400">No Opened Chat</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chats;

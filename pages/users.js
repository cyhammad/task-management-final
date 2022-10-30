import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import SubNavBar from "../components/SubNavBar";
import { faker } from "@faker-js/faker";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import User from "../components/User";
import {
  collection,
  collectionGroup,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Pagination } from "../utility/Pagination";
import { filterbySearch } from "../utility/filter";
import { useEffect, useState } from "react";
import { UserPlusIcon, CheckIcon } from "@heroicons/react/24/solid";
import AddUserModal from "../components/AddUserModal";
import DeleteUserModal from "../components/DeleteUserModal";

function Users({ userList }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [allSelected, setAllSelected] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const perPage = 4;

  const indexOfLastData = currentPage * perPage;
  const indexOfFirstData = indexOfLastData - perPage;
  const currentData = filteredUsers.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const searchText = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    if (userList.length !== 0) {
      setFilteredUsers(filterbySearch(userList, filter));
    }
  }, [userList, filter, allSelected]);

  const handleAllSelected = () => {
    setAllSelected(!allSelected);
    if (!allSelected) {
      setSelectedUsers(userList);
    } else {
      setSelectedUsers([]);
    }
  };
  console.log("SELECTED:",selectedUsers)
  return (
    <div className="bg-default">
      <Head>
        <title>Task Management | Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Header selectedTab="work" />

      {/* Users */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 min-h-[">
        <h1 className="text-3xl font-semibold mt-11">Users</h1>
        <SubNavBar selectedTab="users">
          <div className="flex gap-x-3 p-0 m-0">
            <div
              className="text-white bg-[#004064] py-[6px] pl-2 pr-3 text-xs rounded flex items-center gap-x-1 cursor-pointer"
              onClick={() => handleAllSelected()}
            >
              {allSelected ? (
                <CheckIcon className="h-4 w-4 p-[1px] border rounded-sm" />
              ) : (
                <CheckIcon className="h-4 w-4 p-[1px] border rounded-sm text-[#004064]" />
              )}
              Select All
            </div>
            <DeleteUserModal multiple={true} selectedUsers={selectedUsers} />
          </div>
        </SubNavBar>
        <div className="mt-5 px-5 py-4 border border-gray-200 rounded-md flex mx-2">
          <MagnifyingGlassIcon className="h-7 w-7 mr-3" />
          <input
            type="text"
            className="bg-inherit w-full focus:outline-none"
            placeholder="Search user by username ..."
            value={filter}
            onChange={searchText.bind(this)}
          />
        </div>
        {currentData.map((user) => (
          <>
            <User
              name={user.name}
              userId={user.uid}
              email={user.email}
              phone={user.phoneNumber ? user.phoneNumber : "0000 0000000"}
              status="active"
              profileImage={user.profilePic}
              lastSeen="12 mins ago."
              select={allSelected}
              key={user.uid}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
            />
          </>
        ))}
      </div>
      {/* Pagination */}
      <div className="px-16 py-8">
        <Pagination
          perPage={perPage}
          totalData={userList.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
export async function getServerSideProps() {
  var userList = [];
  const users = query(collection(db, "users"));
  const querySnapshot = await getDocs(users);
  querySnapshot.forEach((doc) => {
    if (doc.data().superuser !== true) {
      userList.push(JSON.parse(JSON.stringify(doc.data())));
    }
  });
  return {
    props: {
      userList,
    },
  };
}
export default Users;

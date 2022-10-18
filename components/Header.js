import Image from "next/image";
import {
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline"
import {
  ChevronDownIcon,
} from "@heroicons/react/20/solid"
import Dropdown from "./Dropdown";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { collection, query } from "firebase/firestore";
import { db } from "../firebase";
import SearchModal from "./SearchModal";

function Header(props) {
  const { user, logout } = useAuth();

  const toggleLogoutDropDown = () => {
    document.getElementById("logoutdropdown").classList.toggle("hidden");
  }
  return (
    <div>
        <div className="h-16 flex xl:mx-auto border-b-2 border-gray-100 px-4 sm:px-6 md:px-8 lg:px-10 shadow-sm">
          {/* Left */}
          <div className="relative w-24 cursor-pointer">
            <Image src="https://firebasestorage.googleapis.com/v0/b/taskmanagement-a5d8a.appspot.com/o/LOGO.PNG?alt=media&token=4357c703-28fd-476b-b998-0525088436c0" layout="fill" alt="Profile" objectFit="contain" />
          </div>

          <div className="justify-between grow hidden lg:inline-flex">
            {/* Middle */}
            <div className="flex items-center space-x-10 text-gray-400 font-medium">
              <div className="ml-10"></div>
              <div className={props.selectedTab == "work"? "nav-item nav-selected": "nav-item"}>
                <div className="text-center">
                  <Link href="/">
                    <a>
                      Work
                    </a>
                  </Link>
                </div>
              </div>
              <div className={props.selectedTab == "settings"? "nav-item nav-selected": "nav-item"}>
                <div className="text-center">
                  <Link href="/settings">
                    <a>
                      Settings
                    </a>
                  </Link>
                </div>
              </div>
              
            </div>

            {/* Right */}
            <div className="flex items-center justify-end space-x-4">
              <SearchModal />
              <div className="relative navBtn">
                <div className="absolute h-2 w-2 bg-yellow-400 rounded-full right-1"></div>
                <BellIcon className="navBtn" />
              </div>
              
              <div className="relative inline-block">
                <div>
                <div className="flex items-center space-x-1 navBtn" onClick={()=>toggleLogoutDropDown()}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={user.photoURL} alt="profile" className="h-10 w-10 cursor-pointer rounded-full" />
                  <ChevronDownIcon className="h-4" />
                </div>
                </div>
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden" id="logoutdropdown" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                <div className="py-1" role="none">
                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" onClick={logout}>Log Out</a>
                </div>
                </div>
            </div>
            </div>
          </div>

          <div className="flex justify-end grow items-center lg:hidden">
            <Dropdown toggleBtn={<Bars3Icon className="w-6 h-6 cursor-pointer" />} />
          </div>
        </div>
        <div className="flex lg:hidden  pt-4 px-4 sm:px-6 md:px-8 space-x-4">
          <div  className="rounded-md text-sm px-1">
            <Link href="/">
              Work
            </Link>
          </div>
          <div  className="rounded-md text-sm px-1 text-gray-400">
            <Link href="/settings">
              Settings
            </Link>
          </div>
        </div>
    </div>
  )
}

export default Header

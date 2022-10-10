import Link from 'next/link'
import React from 'react'

function SubNavBar({selectedTab, children}) {
  return (
    <div className='flex justify-between items-center border-b-2 border-gray-100'>
      <div className="h-8 mt-4 flex justify-between lg:justify-start">
        <div className={selectedTab == "projects" ? "sub-nav-item sub-nav-selected": "sub-nav-item"}>
            <div className="text-center">
                <Link href="/">
                    <a>
                        Projects
                    </a>
                </Link>
            </div>
        </div>
        <div className={selectedTab == "quicktasks" ? "sub-nav-item sub-nav-selected": "sub-nav-item"}>
            <div className="text-center">
                <Link href="/quicktasks">
                    <a>
                        Quick Tasks
                    </a>
                </Link>
            </div>
        </div>
        <div className={selectedTab == "categories" ? "sub-nav-item sub-nav-selected": "sub-nav-item"}>
            <div className="text-center">
                <Link href="/categories">
                    <a>
                        Categories
                    </a>
                </Link>
            </div>
        </div>
        <div className={selectedTab == "chats" ? "sub-nav-item sub-nav-selected": "sub-nav-item"}>
            <div className="text-center">
                <Link href="/chats">
                    <a>
                        Chats
                    </a>
                </Link>
            </div>
        </div>
        <div className={selectedTab == "users" ? "sub-nav-item sub-nav-selected": "sub-nav-item"}>
            <div className="text-center">
                <Link href="/users">
                    <a>
                        Users
                    </a>
                </Link>
            </div>
        </div>
      </div>
      {children}
    </div>
  )
}

export default SubNavBar
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Dashboard = ({ pageChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    pageChange(activeIndex);
    if (window.innerWidth > 633) {
      setSidebarOpen(true);
    }
  }, [activeIndex]);

  const { currentUser } = useSelector((state) => state.user);
  const navLinks = [
    {
      navItem: "Profile",
      icon: "",
    },
    {
      navItem: "Listings",
      icon: "",
    },
    {
      navItem: "Bookings",
      icon: "",
    },
  ];
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log(sidebarOpen);
  };
  return (
    <>
      <button
        onClick={toggleSidebar}
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarOpen && "sm:top-36 sm:mt-0"} ${
          typeof window !== "undefined" && window.innerWidth >= 633
            ? "top-36"
            : "top-36"
        } sm:top-36 sm:mt-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <a href="#" className="flex items-center ps-2.5 mb-5 gap-2">
            <img
              className="rounded-full h-10 w-10 object-cover"
              src={currentUser.gravatar}
              alt="profile"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              {currentUser.name}
            </span>
          </a>
          <ul className="space-y-2 font-medium">
            <li
              className={
                " cursor-pointer slex space-x-3 p-3 rounded " +
                (activeIndex == 0 ? "bg-slate-200" : "")
              }
              onClick={() => setActiveIndex(0)}
            >
              <span className="ms-3">Profile</span>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Dashboard;

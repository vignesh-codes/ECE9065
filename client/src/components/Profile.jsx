import React, { useState } from "react";
import { FaUserClock } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";

export const Profile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  // Toggle the visibility of the dropdown menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.closest("#profile-container")) return;
    setIsMenuOpen(false);
  };

  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div id="profile-container" className="relative">
      {/* Profile Picture */}
      <img
        alt="profile"
        src="https://ui-avatars.com/api/?background=random&name="
        className="relative inline-block h-10 w-10 cursor-pointer rounded-full object-cover object-center"
        onClick={toggleMenu} // Toggle dropdown on click
      />

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <ul
          role="menu"
          className="absolute z-10 right-0 mt-2 min-w-[180px] overflow-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg shadow-sm focus:outline-none"
        >
          <li
            role="menuitem"
            className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
            onClick={() => console.log("Sign Out Clicked")} // Handle Sign Out logic here
          >
            <FaUserClock></FaUserClock>

            <a href="/orders" className="text-slate-800 font-medium ml-2">Completed Orders</a>
            
          </li>
          <li
            role="menuitem"
            className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
            onClick={() => console.log("Sign Out Clicked")} // Handle Sign Out logic here
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-slate-400"
            >
              <path
                fillRule="evenodd"
                d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z"
                clipRule="evenodd"
              />
            </svg>

            <p onClick={handleSignOut} className="text-slate-800 font-medium ml-2">Sign Out</p>
            
          </li>
          
        </ul>
      )}
    </div>
  );
};

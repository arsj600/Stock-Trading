import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../state/authSlice";
import Logo from "../assets/Logo.png";
import sidebar from "../assets/sidebar.png";
import cross from "../assets/cross.png";
import profile from "../assets/profile.png";

export const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { token, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  return (
    <>
      <div className="sticky top-0 z-50 bg-white shadow-md flex items-center justify-between py-2 font-medium">
        {/* Left side of Navbar */}
        <Link to="/" className="ml-4">
          <img src={Logo} className="w-28 sm:w-32 md:w-36" />
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6 text-gray-500 pr-8">
          <NavLink to="/dashboard" className="hidden sm:block hover:text-black">
            DashBoard
          </NavLink>
          <NavLink to="/stocklist" className="hidden sm:block hover:text-black">
            Stocks
          </NavLink>
          <NavLink to="/social" className="hidden sm:block hover:text-black">
            Social
          </NavLink>
          <NavLink to="/edu" className="hidden sm:block hover:text-black">
            Edu.
          </NavLink>

          {token ? (
            <>
              <NavLink to="/profile" className="hidden sm:block">
                <img
                  src={profile}
                  className="h-7 w-7 rounded-full object-cover"
                />
              </NavLink>
              <button
                onClick={() => dispatch(logout())}
                className="hidden sm:block text-red-600 font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="hidden sm:block hover:text-black font-semibold"
            >
              SignUp/Login
            </NavLink>
          )}
        </div>

        {/* Sidebar toggle */}
        <div>
          {!showMenu ? (
            <img
              src={sidebar}
              className="h-10 w-10 cursor-pointer"
              alt="Sidebar"
              onClick={() => setShowMenu(true)}
            />
          ) : (
            <img
              src={cross}
              className="h-10 w-10 cursor-pointer"
              alt="Close"
              onClick={() => setShowMenu(false)}
            />
          )}
        </div>
        {/* Popup Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[250px] flex flex-col items-center gap-6 relative
            sm:fixed sm:top-6 sm:right-8 sm:inset-auto sm:items-start sm:min-w-[300px] sm:gap-4
            ">
            <img
              src={cross}
              alt="Close"
              className="absolute top-4 right-4 h-6 w-6 cursor-pointer"
              onClick={() => setShowMenu(false)}
            />
            <NavLink to="/profile" className="text-lg font-semibold hover:text-blue-600" onClick={() => setShowMenu(false)}>Profile</NavLink>
            <NavLink to="/dashboard" className="text-lg font-semibold hover:text-blue-600" onClick={() => setShowMenu(false)}>DashBoard</NavLink>
            <NavLink to="/watchlist" className="text-lg font-semibold hover:text-blue-600" onClick={() => setShowMenu(false)}>WatchList</NavLink>
            <NavLink to="/about" className="text-lg font-semibold hover:text-blue-600" onClick={() => setShowMenu(false)}>About</NavLink>
            <NavLink to="/support" className="text-lg font-semibold hover:text-blue-600" onClick={() => setShowMenu(false)}>Support</NavLink>
            <NavLink to="/login" className="text-lg font-semibold hover:text-blue-600" onClick={() => setShowMenu(false)}>Logout</NavLink>
          </div>
        </div>
      )}
    </div>
    <hr className="border-gray-300"/>
    </>
  )
}

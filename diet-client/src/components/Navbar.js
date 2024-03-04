import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { settingsSvg, logoutSvg } from "./ComponentsSvg.js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    console.log("isOpen durumu:", isOpen);
  }, [isOpen]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    logout(() => {
      navigate("/login");
    });
  };
  const currentPath = window.location.pathname;
  return (
    <nav className="relative">
      <div className="container px-6 py-0 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center">
            <a
              href={user.role === "admin" ? "/admin/home" : "/home"}
              className="font-mono font-black me-12"
            >
              nutriflare
            </a>
            <div className="lg:flex lg:justify-start hidden">
              {user.role === "user" && (
                <>
                  <a
                    href="/home"
                    className={`nav-a ${
                      currentPath === "/home" ? "nav-color" : ""
                    }`}
                  >
                    Anasayfa
                  </a>
                  <a
                    href="/dietlist"
                    className={`nav-a ${
                      currentPath === "/dietlist" ? "nav-color" : ""
                    }`}
                  >
                    Diyet Listesi
                  </a>
                  <a
                    href="/calories"
                    className={`nav-a ${
                      currentPath === "/calories" ? "nav-color" : ""
                    }`}
                  >
                    Kaloriler
                  </a>
                  <a
                    href="/recipes"
                    className={`nav-a ${
                      currentPath === "/recipes" ? "nav-color" : ""
                    }`}
                  >
                    Tarifler
                  </a>
                </>
              )}
              {user.role === "admin" && (
                <>
                  <a
                    href="/admin/home"
                    className={`nav-a ${
                      currentPath === "/admin/home" ? "nav-color" : ""
                    }`}
                  >
                    Anasayfa
                  </a>
                  <a
                    href="/admin/users"
                    className={`nav-a ${
                      currentPath === "/admin/users" ? "nav-color" : ""
                    }`}
                  >
                    Danışanlar
                  </a>
                  <a
                    href="/admin/recipes"
                    className={`nav-a ${
                      currentPath === "/admin/recipes" ? "nav-color" : ""
                    }`}
                  >
                    Tarifler
                  </a>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden ml-auto">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                aria-label="toggle menu"
              >
                {!isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div
            className={`lg:flex lg:items-center   ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8 lg:hidden">
              {user.role === "user" && (
                <>
                  <a href="/home" className="nav-a-two">
                    Anasayfa
                  </a>
                  <a href="/dietlist" className="nav-a-two">
                    Diyet Listesi
                  </a>
                  <a href="/calories" className="nav-a-two">
                    Kaloriler
                  </a>
                  <a href="/recipes" className="nav-a-two">
                    Tarifler
                  </a>
                </>
              )}
              {user.role === "admin" && (
                <>
                  <a href="/admin/home" className="nav-a-two">
                    Anasayfa
                  </a>
                  <a href="/admin/users" className="nav-a-two">
                    Danışanlar
                  </a>
                  <a href="/admin/recipes" className="nav-a-two">
                    Tarifler
                  </a>
                </>
              )}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center mt-4 lg:mt-0">
              <div className="flex lg:flex-row items-center">
                <a
                  href={user.role === "admin" ? "/admin/profile" : "/profile"}
                  className="mb-4 me-4 lg:mb-0 lg:me-4"
                >
                  {settingsSvg}
                </a>
                <button onClick={handleLogout} className="mb-4 lg:mb-0 lg:me-4">
                  {logoutSvg}
                </button>
              </div>

              <button
                type="button"
                className="flex items-center focus:outline-none lg:mt-0 self-start"
                aria-label="toggle profile dropdown"
              >
                <div className="w-8 h-8 overflow-hidden border-2 border-thorange rounded-full bg-white flex justify-center items-center">
                  <img
                    src={user.profilePhoto}
                    className="object-cover h-full object-fit-cover"
                    alt="avatar"
                  />
                </div>

                <h3 className="mx-2 text-gray-700 lg:hidden">
                  {user.name} {user.surname}
                </h3>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

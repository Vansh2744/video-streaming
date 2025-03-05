"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { IoMdHome, IoMdTrendingUp, IoMdCloudUpload } from "react-icons/io";
import { MdWatchLater } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";
import { FaSignInAlt } from "react-icons/fa";
import { SiGnuprivacyguard } from "react-icons/si";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/getUser");
        console.log(res);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-[700px] items-center justify-center">
        <span className="loading loading-infinity w-60"></span>
      </div>
    );
  }

  const handleSignout = async () => {
    try {
      const res = await axios.post("/api/signout");
      toast.success(res.data.message);
      setUser(null);
      setDropdown(false);
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Toaster />
      <div className="w-full py-5 px-10 sm:visible hidden sm:block">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-3xl text-center text-white font-bold">
            VibeVid
          </Link>
          <div className="flex gap-10">
            <div className="flex items-center gap-2 text-xl hover:scale-105 font-extrabold">
              <IoMdHome />
              <Link href="/">Home</Link>
            </div>
            {user ? (
              <>
                <div className="flex items-center gap-2 text-xl hover:scale-105 font-extrabold">
                  <IoMdTrendingUp />
                  <Link href="/trendingPage">Trending</Link>
                </div>
                <div className="flex items-center gap-2 text-xl hover:scale-105 font-extrabold">
                  <MdWatchLater />
                  <Link href="/watchlater">Watch Later</Link>
                </div>
                <div className="flex items-center gap-2 text-xl hover:scale-105 font-extrabold">
                  <BiSolidLike />
                  <Link href="/likedVideosPage">Liked Videos</Link>
                </div>
                <div className="flex items-center gap-2 text-xl hover:scale-105 font-extrabold">
                  <IoMdCloudUpload />
                  <Link href="/upload">Upload</Link>
                </div>
                <div className="flex items-center gap-2 text-xl hover:scale-105 font-extrabold">
                  <FaUserCircle />
                  <Link href="/profile">Profile</Link>
                </div>
                <div>
                  <FaUserCircle
                    className="relative text-orange-600 h-10 w-10 hover:cursor-pointer"
                    onClick={() => setDropdown(!dropdown)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xl hover:scale-105 font-extrabold">
                  <FaSignInAlt />
                  <Link href="/sign-in">Sign In</Link>
                </div>
                <div className="flex items-center gap-2 text-xl hover:scale-105 font-extrabold">
                  <SiGnuprivacyguard />
                  <Link href="/sign-up">Sign Up</Link>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>

      <div className="navbar bg-base-100 sm:hidden visible">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              {user && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              )}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="trendingPage">Trending</Link>
              </li>
              <li>
                <Link href="/watchlater">Watch Later</Link>
              </li>
              <li>
                <Link href="/likedVideosPage">Liked Videos</Link>
              </li>
              <li>
                <Link href="/upload">Upload</Link>
              </li>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <Link href="/" className="btn btn-ghost text-2xl">
            VibeVide
          </Link>
        </div>
        <div className="flex gap-5 ml-2 w-full">
          {user ? (
            <>
              <div>
                <FaUserCircle
                  className="relative text-orange-600 h-10 w-10 hover:cursor-pointer"
                  onClick={() => setDropdown(!dropdown)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1 text-md text-orange-600 hover:scale-105 font-extrabold">
                <Link href="/sign-in">Sign In</Link>
              </div>
              <div className="flex items-center gap-1 text-md text-orange-600 hover:scale-105 font-extrabold">
                <Link href="/sign-up">Sign Up</Link>
              </div>
            </>
          )}
        </div>
      </div>
      {dropdown && (
        <div className="absolute top-20 right-5 flex items-center gap-2 hover:scale-105 font-extrabold bg-slate-600 px-4 py-2 rounded-xl">
          <FaSignOutAlt />
          <button onClick={handleSignout}>Sign Out</button>
        </div>
      )}
    </>
  );
}

export default Navbar;

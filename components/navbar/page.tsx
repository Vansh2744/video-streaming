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
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="w-full py-5 px-10">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-3xl text-center text-white font-bold">
            Video Streaming
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
                  <Link href="/trending">Trending</Link>
                </div>
                <div className="flex items-center gap-2 text-xl hover:scale-105 font-extrabold">
                  <MdWatchLater />
                  <Link href="/watchlater">Watch Later</Link>
                </div>
                <div className="flex items-center gap-2 text-xl hover:scale-105 font-extrabold">
                  <BiSolidLike />
                  <Link href="/likedvideos">Liked Videos</Link>
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

        <Toaster />
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

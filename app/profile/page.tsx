"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  views: number;
  likes: number;
  user: {
    id: string;
    username: string;
  };
}

interface User {
  id: string;
  username: string;
  pic: string;
  likedVideos: Video[];
  videos: Video[];
  watchLaterVideos: Video[];
}

function Profile() {
  const [user, setUser] = useState<User>({
    id: "",
    username: "",
    pic: "",
    likedVideos: [],
    videos: [],
    watchLaterVideos: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/getUser");
        setUser(res.data.user);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-[700px] items-center justify-center">
        <span className="loading loading-infinity w-60"></span>
      </div>
    );
  }

  return (
    <div className="px-10">
      <div className="flex sm:flex-row flex-col sm:gap-20 gap-10 sm:px-10 px-5 py-10">
        <Image
          src={user?.pic ? user.pic : "/profile.jpg"}
          width={100}
          height={100}
          alt="not found"
          className="rounded-full shadow-sm shadow-orange-500 sm:h-[200px] h-[150px] sm:w-[200px] w-[150px]"
        />
        <div className="flex flex-col justify-center gap-10">
          <p className="sm:text-5xl text-3xl font-extrabold text-orange-500">
            {user?.username}
          </p>
          <div className="flex sm:gap-5 gap-3 font-extrabold sm:text-lg text-md">
            <Link
              href="/watchlater"
              className="bg-cyan-500 sm:px-3 px-2 py-1 rounded-full hover:bg-cyan-400"
            >
              Watch Later
            </Link>
            <Link
              href="/liked"
              className="bg-cyan-500 px-3 py-1 rounded-full hover:bg-cyan-400"
            >
              Liked Videos
            </Link>
          </div>
        </div>
      </div>
      <hr />
      <div className="grid sm:grid-cols-2 grid-col-1 gap-10 py-10">
        {user?.videos.map((video: Video) => (
          <Link
            key={video.id}
            href={{
              pathname: "/video",
              query: {
                id: video.id,
                userId: video.user?.id,
              },
            }}
          >
            <div className="w-full bg-black flex flex-col gap-5 shadow-md shadow-cyan-500 hover:shadow-lg hover:shadow-cyan-400">
              <video src={video.url} className="w-full"></video>
              <div className="sm:px-10 px-5 sm:pb-5 pb-3">
                <p className="sm:text-2xl text-lg font-bold text-orange-600">
                  {video.title}
                </p>
                <p className="sm:text-lg text-sm">{video.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Profile;

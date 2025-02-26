"use client";

import React, { useEffect, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

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
  username: string;
  url: string;
  pic: string;
  videos: Video[];
}

function UserProfile() {
  const params = useSearchParams();
  const userId = params.get("userId");
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User>({
    username: "",
    url: "",
    pic: "",
    videos: [],
  });

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/userProfile", {
          params: {
            userId,
          },
        });
        setUser(res.data.user);
        setLoading(false);
      } catch (error) {
        console.error(error);
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
  return (
    <div className="px-10">
      <div className="flex sm:flex-row flex-col sm:gap-20 gap-10 sm:px-10 px-5 py-10">
        <Image
          src={user?.pic}
          width={100}
          height={100}
          alt="not found"
          className="rounded-full shadow-sm shadow-orange-500 sm:h-[200px] h-[150px] sm:w-[200px] w-[150px]"
        />
        <div className="flex flex-col justify-center gap-10">
          <p className="sm:text-5xl text-3xl font-extrabold text-orange-500">
            {user?.username}
          </p>
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
                title: video.title,
                description: video.description,
                views: video.views,
                likes: video.likes,
                url: video.url,
                thumbnail: video.thumbnail,
                username: video.user?.username,
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

function Profile() {
  return (
    <Suspense>
      <UserProfile />
    </Suspense>
  );
}

export default Profile;

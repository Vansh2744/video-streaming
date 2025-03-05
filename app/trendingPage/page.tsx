"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  likes: number;
  views: number;
  user: {
    id: string;
    username: string;
    pic: string;
  };
}

function TrendingPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/trending");
        setVideos(res.data.videos);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-[700px] items-center justify-center">
        <span className="loading loading-infinity w-60"></span>
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 grid-col-1 gap-10 my-10 sm:px-20 px-10">
      {videos.map((video) => (
        <div
          key={video.id}
          className="shadow-md shadow-cyan-500 hover:shadow-lg hover:shadow-cyan-400 hover:cursor-pointer flex flex-col gap-5 bg-black"
        >
          <Link
            href={{
              pathname: "/video",
              query: {
                id: video.id,
                userId: video.user?.id,
              },
            }}
          >
            <video
              src={video.url}
              poster={video.thumbnail}
              className="shadow-md"
            />
          </Link>
          <div className="flex items-center gap-20 px-5">
            <div>
              <Link
                href={{
                  pathname: "/userProfile",
                  query: {
                    userId: video.user?.id,
                  },
                }}
              >
                <FaUserCircle className="text-5xl text-orange-500" />
              </Link>
              <h1 className="font-extrabold">{video.user?.username}</h1>
            </div>
            <div className="flex flex-col gap-2 pb-2">
              <h1 className="text-2xl font-bold text-orange-600">
                {video.title}
              </h1>
              <p className="text-lg">{video.description}</p>
            </div>
          </div>
          <div className="flex justify-between px-5 py-3">
            <div>
              <p className="font-extrabold">{video.likes} Likes</p>
            </div>
            <div>
              <p className="font-extrabold">{video.views} Views</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrendingPage;

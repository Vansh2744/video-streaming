"use client";

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

function Watchlater() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWatchlater = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/getWatchlater");
        setVideos(res.data.videos);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getWatchlater();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-[700px] items-center justify-center">
        <span className="loading loading-infinity w-60"></span>
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 grid-col-1 gap-10 px-10 py-10">
      {videos.map((video: Video) => (
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
          <div className="bg-black flex flex-col gap-5 shadow-md shadow-cyan-500 hover:shadow-lg hover:shadow-cyan-400">
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
  );
}

export default Watchlater;

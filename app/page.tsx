"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

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

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/getVideos", {
          withCredentials: true,
        });
        const filteredVideos = res.data.videos.filter(
          (video: Video) =>
            video.title.toLowerCase().includes(search.toLowerCase()) ||
            video.description.toLowerCase().includes(search.toLowerCase()) ||
            video.user.username.toLowerCase().includes(search.toLowerCase())
        );
        setVideos(filteredVideos);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await axios.get("/api/getVideos", {
        withCredentials: true,
      });
      const filteredVideos = res.data.videos.filter(
        (video: Video) =>
          video.title.toLowerCase().includes(search.toLowerCase()) ||
          video.description.toLowerCase().includes(search.toLowerCase()) ||
          video.user.username.toLowerCase().includes(search.toLowerCase())
      );
      setVideos(filteredVideos);
      setSearch("");
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[700px] items-center justify-center">
        <span className="loading loading-infinity w-60"></span>
      </div>
    );
  }
  return (
    <div className="sm:px-10 px-5 sm:py-10 py-5">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered focus:outline-none sm:ml-20 ml-10 sm:w-96"
          placeholder="Search"
        />
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-2 rounded"
          onClick={handleSubmit}
        >
          search
        </button>
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-10 my-10 sm:px-20 px-10">
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
                  title: video.title,
                  description: video.description,
                  url: video.url,
                  thumbnail: video.thumbnail,
                  views: video.views,
                  likes: video.likes,
                  username: video.user?.username,
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
          </div>
        ))}
      </div>
    </div>
  );
}

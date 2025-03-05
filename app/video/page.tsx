"use client";

import React, { useState, useEffect, Suspense } from "react";
import { AiFillLike } from "react-icons/ai";
import { useSearchParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { BiSolidCommentDetail } from "react-icons/bi";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
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
  id: string;
  username: string;
  likedVideos: Video[];
}

interface likedVideo {
  videoId: string;
  userId: string;
}

interface Comment {
  description: string;
  user: {
    pic: string;
    username: string;
  };
}

function Video() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const userId = params.get("userId") ?? "";

  const [videos, setVideos] = useState<Video[]>([]);
  const [user, setUser] = useState<User>({
    id: "",
    username: "",
    likedVideos: [],
  });
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [watchlaterLoading, setWatchlaterLoading] = useState(false);
  const [toggleComment, setToggleComment] = useState(false);
  const [comment, setComment] = useState("");
  const [listComments, setListComments] = useState<Comment[]>([]);
  const [video, setVideo] = useState<Video>({
    id: "",
    title: "",
    description: "",
    url: "",
    thumbnail: "",
    views: 0,
    likes: 0,
    user: {
      id: "",
      username: "",
    },
  });
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);

  const handleLike = async () => {
    setScreenLoading(true);
    try {
      const res = await axios.post("/api/likes", {
        userId: user.id,
        videoId: video.id,
      });
      setLikes(res.data.video.likes);
      setIsLiked(res.data.isLiked);
      setScreenLoading(false);
    } catch (error) {
      console.error(error);
      setScreenLoading(false);
    }
  };

  useEffect(() => {
    const getVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/getVideos");
        const filteredVideos = res.data.videos.filter((video: Video) =>
          video.description
            .toLowerCase()
            .includes(video.title.toLowerCase().trim().split(" ")[0])
        );

        setVideos(filteredVideos);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getVideos();
  }, [video.title]);

  const handleHideVideo = (video: Video) => {
    if (video.id === id) {
      return true;
    }
  };

  useEffect(() => {
    const video = async () => {
      setLoading(true);
      try {
        const res = await axios.post("/api/getVideo", {
          id,
        });
        setVideo(res.data.video);
        setLikes(res.data.video.likes);
        setViews(res.data.video.views);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    video();
  }, [id]);

  useEffect(() => {
    const user = async () => {
      try {
        const res = await axios.get("/api/getUser");
        setUser(res.data.user);
        if (
          res.data.user.likedVideos.some(
            (likedVideo: likedVideo) => likedVideo.videoId === id
          )
        ) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    const getComments = async () => {
      try {
        const res = await axios.get("/api/getComments", {
          params: {
            videoId: id,
          },
        });
        setListComments(res.data.comments);
      } catch (error) {
        console.error(error);
      }
    };
    user();
    getComments();
  }, [comment, id]);

  const handleWatchlater = async () => {
    try {
      setWatchlaterLoading(true);
      const res = await axios.post("/api/watchlater", {
        userId: user.id,
        videoId: id,
      });
      setWatchlaterLoading(false);
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async () => {
    try {
      await axios.post("/api/comment", {
        comment,
        userId: user.id,
        videoId: id,
      });
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleVideoEnd = async () => {
    try {
      setScreenLoading(true);
      const res = await axios.post("/api/getVideo", { id });
      await axios.post("/api/updateViews", {
        updatedViews: res.data.video.views + 1,
        id,
      });
      setViews(res.data.video.views);
      setScreenLoading(false);
    } catch (error) {
      console.error(error);
      setScreenLoading(false);
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
    <div className="sm:px-20 px-10 py-10 flex sm:flex-row flex-col sm:gap-10 gap-20">
      <div className="bg-black flex flex-col sm:gap-10 gap-5 h-full min-w-screen">
        <video
          src={video.url || undefined}
          controls
          autoPlay
          poster={video.thumbnail}
          onEnded={handleVideoEnd}
        ></video>
        <div className="flex items-center gap-20 px-5">
          <div>
            <Link
              href={{
                pathname: "/userProfile",
                query: {
                  userId,
                },
              }}
            >
              <FaUserCircle className="sm:text-5xl text-3xl text-orange-500" />
            </Link>
            <h1 className="font-extrabold">{video.user.username}</h1>
          </div>
          <div className="flex flex-col gap-2 pb-2">
            <h1 className="sm:text-2xl text-lg font-bold text-orange-600">
              {video.title}
            </h1>
            <p className="sm:text-lg text-sm">{video.description}</p>
          </div>
        </div>
        <div className="flex sm:gap-10 gap-5 px-5 pb-5">
          <div>
            <p className="sm:text-lg text-sm">{views} views</p>
          </div>
          <div className="flex gap-2 items-center sm:text-3xl text-lg">
            <AiFillLike
              className={`hover:cursor-pointer ${
                isLiked ? "text-blue-500" : ""
              }`}
              onClick={handleLike}
            />
            <p>{likes}</p>
          </div>
          <div
            className="flex gap-2 sm:text-lg text-sm items-center font-extrabold bg-orange-600 px-2 py-1 rounded-full hover:cursor-pointer"
            onClick={handleWatchlater}
          >
            <p>Watchlater</p>
            <p>+</p>
          </div>
          <div className="flex gap-2 items-center sm:text-3xl text-lg">
            <BiSolidCommentDetail
              className={"hover:cursor-pointer"}
              onClick={() => setToggleComment((prev) => !prev)}
            />
          </div>
          <p>{}</p>
        </div>
        {(watchlaterLoading || screenLoading) && (
          <div className="flex flex-col items-center justify-center">
            <span className="loading loading-infinity w-10"></span>
          </div>
        )}
        <div className="p-3 flex flex-col gap-2">
          <textarea
            name=""
            className="w-full bg-slate-800 p-2"
            placeholder="Enter Your Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button
            className="bg-orange-500 rounded-xl sm:py-2 py-1"
            onClick={handleComment}
          >
            submit
          </button>
        </div>
        {toggleComment && (
          <div className="bg-slate-600 m-2 p-2 flex flex-col gap-5">
            {listComments.map((comment, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Image
                    src={comment.user.pic}
                    height={10}
                    width={10}
                    alt="not found"
                    className="h-7 w-7"
                  />
                  <p className="text-lg font-extrabold text-orange-500">
                    {comment.user.username}
                  </p>
                </div>
                <p>{comment?.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="w-full sm:hidden visible" />
      <div className="flex flex-col gap-10">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={{
              pathname: "/video",
              query: {
                id: video.id,
              },
            }}
          >
            <div
              key={video.id}
              className={`max-w-screen-sm ${
                handleHideVideo(video) ? "hidden" : ""
              } bg-black flex flex-col gap-5`}
            >
              <video src={video.url} poster={video.thumbnail}></video>
              <div className="flex items-center gap-20 px-5">
                <div className="flex flex-col gap-2 pb-2">
                  <h1 className="sm:text-2xl text-lg font-bold text-orange-600">
                    {video.title}
                  </h1>
                  <p className="sm:text-lg text-sm">{video.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function VideoSuspense() {
  return (
    <Suspense>
      <Video />
    </Suspense>
  );
}

export default VideoSuspense;

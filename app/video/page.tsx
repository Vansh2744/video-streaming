"use client";

import React from "react";
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { FaShare } from "react-icons/fa";
import { MdDownload } from "react-icons/md";

function Video() {
  return (
    <div>
      <div className="py-20">
        <iframe
          width="600"
          height="600"
          src="https://ik.imagekit.io/yrq1ay1rp/video-streaming/videoplayback_YbCKGVOhs.mp4?updatedAt=1739106671958"
        ></iframe>
        <div className="flex gap-10">
          <AiFillLike className="text-4xl cursor-pointer" />
          <AiFillDislike className="text-4xl cursor-pointer" />
          <FaShare className="text-4xl cursor-pointer" />
          <a
            href="https://ik.imagekit.io/yrq1ay1rp/video-streaming/videoplayback_YbCKGVOhs.mp4?updatedAt=1739106671958"
            download={
              "https://ik.imagekit.io/yrq1ay1rp/video-streaming/videoplayback_YbCKGVOhs.mp4?updatedAt=1739106671958"
            }
            className="flex gap-2 bg-slate-600 rounded-full px-4 py-2 cursor-pointer"
          >
            <MdDownload className="text-2xl" />
            download
          </a>
        </div>
      </div>
    </div>
  );
}

export default Video;

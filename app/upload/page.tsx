"use client";

import React, { FormEvent, useRef, useState } from "react";
import { MdSubtitles } from "react-icons/md";
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import axios from "axios";
import toast from "react-hot-toast";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

interface Error {
  message: string;
}

interface AuthResponse {
  signature: string;
  expire: number;
  token: string;
}

interface UploadResponse {
  fileId: string;
  name: string;
  url: string;
  height?: number;
  width?: number;
  size?: number;
  filePath?: string;
}

function Upload() {
  const videoRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  const [video, setVideo] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoPreparing, setVideoPreparing] = useState(false);
  const [thumbnailPreparing, setThumbnailPreparing] = useState(false);

  const authenticator = async (): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/auth");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data: AuthResponse = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error}`);
    }
  };

  const onError = (err: Error) => {
    console.log("Error", err);
  };

  const onVideoStart = () => {
    setVideoPreparing(true);
  };

  const onThumbnailStart = () => {
    setThumbnailPreparing(true);
  };

  const onVideoSuccess = (res: UploadResponse) => {
    setVideoPreparing(false);
    toast.success("Video prepared to upload");
    setVideo(res.url);
  };

  const onThumbnailSuccess = (res: UploadResponse) => {
    setThumbnailPreparing(false);
    toast.success("Thumbnail prepared to upload");
    setThumbnail(res.url);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/api/upload", {
        video,
        thumbnail,
        title,
        description,
      });

      toast.success(res.data.message);
      setTitle("");
      setDescription("");
      setVideo("");
      setThumbnail("");
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (videoPreparing) {
    return (
      <div className="toast toast-top toast-center flex flex-col justify-center h-full items-center">
        <div className="alert alert-success">
          <span>Preparing Video to upload please wait...</span>
        </div>
      </div>
    );
  }

  if (thumbnailPreparing) {
    return (
      <div className="toast toast-top toast-center flex flex-col justify-center h-full items-center">
        <div className="alert alert-success">
          <span>Preparing Thumbnail to upload please wait...</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col h-[700px] items-center justify-center">
        <span className="loading loading-infinity w-60"></span>
      </div>
    );
  }

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <div>
        <div className="flex flex-col items-center justify-center h-[700px]">
          <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-center input input-bordered w-full max-w-xs shadow-md shadow-cyan-400"
              />
              <MdSubtitles className="text-3xl absolute top-2.5 left-2.5" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-center input input-bordered w-full max-w-xs shadow-md shadow-cyan-400"
              />
              <MdSubtitles className="text-3xl absolute top-2.5 left-2.5" />
            </div>
            <IKUpload
              ref={videoRef}
              onUploadStart={onVideoStart}
              onError={onError}
              folder="Videos"
              accept="video/*"
              style={{
                display: "none",
              }}
              onSuccess={onVideoSuccess}
            />

            <IKUpload
              ref={thumbnailRef}
              onUploadStart={onThumbnailStart}
              onError={onError}
              folder="Thumbnail"
              style={{
                display: "none",
              }}
              onSuccess={onThumbnailSuccess}
              fileName="vansh.jpg"
            />

            <button
              className="bg-slate-800 px-8 py-3 rounded-full shadow-md shadow-cyan-400"
              onClick={(e) => {
                e.preventDefault();
                videoRef.current?.click();
              }}
            >
              Upload Video (max 100mb)
            </button>

            <button
              className="bg-slate-800 px-8 py-3 rounded-full shadow-md shadow-cyan-400"
              onClick={(e) => {
                e.preventDefault();
                thumbnailRef.current?.click();
              }}
            >
              Upload Thumbnail (max 100mb)
            </button>

            <button className="btn bg-orange-600 mt-5">Upload</button>
          </form>
        </div>
      </div>
    </ImageKitProvider>
  );
}

export default Upload;

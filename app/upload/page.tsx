"use client";

import React, { useRef } from "react";
import { MdSubtitles } from "react-icons/md";
import { ImageKitProvider, IKUpload } from "imagekitio-next";

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

  const onVideoSuccess = (res: UploadResponse) => {
    console.log("Video : ", res);
  };

  const onThumbnailSuccess = (res: UploadResponse) => {
    console.log("Thumbnail : ", res);
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <div>
        <div className="bg-slate-400 flex flex-col items-center justify-center h-[700px]">
          <form className="flex flex-col gap-5 ">
            <div className="relative">
              <input
                type="text"
                placeholder="Title"
                className="text-center input input-bordered w-full max-w-xs"
              />
              <MdSubtitles className="text-3xl absolute top-2.5 left-2.5" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Description"
                className="text-center input input-bordered w-full max-w-xs"
              />
              <MdSubtitles className="text-3xl absolute top-2.5 left-2.5" />
            </div>
            <IKUpload
              ref={videoRef}
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
              onError={onError}
              folder="/Thumbnail"
              style={{
                display: "none",
              }}
              onSuccess={onThumbnailSuccess}
              fileName="vansh.jpg"
            />

            <button
              className="bg-slate-800 px-8 py-3 rounded-full"
              onClick={() => videoRef.current?.click()}
            >
              Upload Video
            </button>

            <button
              className="bg-slate-800 px-8 py-3 rounded-full"
              onClick={() => thumbnailRef.current?.click()}
            >
              Upload Thumbnail
            </button>
          </form>
        </div>
      </div>
    </ImageKitProvider>
  );
}

export default Upload;

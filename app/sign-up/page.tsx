"use client";

import React, { FormEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password should be atleast 8 characters");
      return;
    }

    if (
      !(
        password.includes("@") ||
        password.includes("#") ||
        password.includes("$") ||
        password.includes("%") ||
        password.includes("&")
      )
    ) {
      toast.error("Password should contain atleast one of @, #, $, %, &");
      return;
    }

    try {
      const res = await axios.post("/api/signup", {
        email,
        username,
        password,
      });
      toast.success(res.data.message);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="h-[500px] mt-20 flex flex-col sm:gap-10 gap-5 items-center justify-center sm:w-[700px] w-[330px] rounded-xl shadow-xl shadow-slate-500">
        <h1 className="sm:text-4xl text-2xl font-extrabold">Sign Up</h1>
        <form
          className="sm:w-[600px] w-[300px] flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="relative input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              className="grow"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <FaEye
                className="absolute top-3.5 z-10 cursor-pointer text-white right-5"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <FaEyeSlash
                className="absolute top-3.5 z-10 cursor-pointer text-white right-5"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </label>
          <button className="btn my-5" type="submit">
            Submit
          </button>
        </form>
        <span>
          Already have an account{" "}
          <Link href="/sign-in" className="text-orange-600">
            signin
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Signup;

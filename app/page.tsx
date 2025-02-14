"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  email: string;
  username: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/getUser");
        setUser(res.data.user);
        console.log(res.data);
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
    <div className="grid grid-cols-3 gap-4">
      <h1 className="text-2xl">{user?.email}</h1>
      <h1 className="text-2xl">{user?.username}</h1>
    </div>
  );
}

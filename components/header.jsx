"use client";

import { useEffect, useState } from "react";

export default function HeaderBar() {
  const [userData, setUserData] = useState("");
  async function fetchMydata() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/mydata`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const output = await res.json();
    console.log(output);
    setUserData(output.userData);
  }
  useEffect(() => {
    fetchMydata();
  }, []);
  return (
    <>
      <div className="bg-white w-full flex flex-row border border-black justify-between p-5 items-center">
        <div>
          <h2 className="text-2xl text-black font-bold">Chat-App</h2>
        </div>

        <div>
          <h4 className="text-xl text-black">Signed as {userData.userName}</h4>
        </div>
      </div>
    </>
  );
}

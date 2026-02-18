"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");
  const router = useRouter();
  async function verifyandredirect() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: userEmail,
        userPass: userPass,
      }),
    });
    const output = await res.json();
    console.log(output);
    if (output.success === true) {
      localStorage.setItem("token", output.token);
      localStorage.setItem("userId", output.userId);
      router.replace("/home");
    }
  }
  return (
    <>
      <div className="flex min-h-screen bg-white flex-col justify-center items-center">
        <div className="flex flex-col border border-black rounded-4xl h-100 w-100 justify-center items-center">
          <div className="flex flex-row items-center">
            <h2 className="text-4xl text-black font-bold mr-2">Chat App</h2>
            <div className="flex flex-col">
              <input
                type="text"
                name="userEmail"
                id="userEmail"
                className="text-black border-b-2 border-blue-400 focus:outline-none p-2"
                placeholder="Enter Your Email"
                value={userEmail}
                onChange={(el) => {
                  setUserEmail(el.target.value);
                }}
              />
              <input
                type="password"
                name="userPass"
                id="userPass"
                className="text-black border-b-2 border-blue-400 focus:outline-none p-2"
                placeholder="Enter Your Pass"
                value={userPass}
                onChange={(el) => {
                  setUserPass(el.target.value);
                }}
              />
            </div>
          </div>
          <div
            className="w-full flex justify-center items-center"
            onClick={verifyandredirect}
          >
            <div className="bg-blue-400 h-10 w-[30%] rounded-3xl flex justify-center items-center mt-8 cursor-pointer">
              <h4 className="text-center">Log In</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userPass, setUserPass] = useState(null);
  const router = useRouter();
  async function verifyandredirect() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        userEmail,
        userPass,
      }),
    });

    const output = await res.json();
    console.log(output);
    if (output.success === true) {
      router.replace("/");
    }
  }
  return (
    <>
      <div className="bg-white min-h-screen flex justify-center items-center">
        <div className="border border-black rounded-4xl h-100 w-100 flex justify-center items-center flex-col">
          <div>
            <h2 className="text-2xl font-bold text-black">Chat App</h2>
          </div>

          <div className="w-full p-3">
            <input
              type="text"
              name="userName"
              id="userName"
              placeholder="Enter your name"
              className="p-2 border-b-2 border-blue-400 focus:outline-none my-2 text-black w-full"
              value={userName}
              onChange={(el) => {
                setUserName(el.target.value);
              }}
            />
            <input
              type="text"
              name="userEmail"
              id="userEmail"
              placeholder="Enter your email"
              className="p-2 border-b-2 border-blue-400 focus:outline-none my-2 text-black w-full"
              value={userEmail}
              onChange={(el) => {
                setUserEmail(el.target.value);
              }}
            />
            <input
              type="password"
              name="userPass"
              id="userPass"
              placeholder="Enter your password"
              className="p-2 border-b-2 border-blue-400 focus:outline-none my-2 text-black w-full"
              value={userPass}
              onChange={(el) => {
                setUserPass(el.target.value);
              }}
            />
          </div>
          <div
            className="w-full flex justify-center items-center"
            onClick={verifyandredirect}
          >
            <div className="bg-blue-400 h-10 w-[30%] rounded-3xl flex justify-center items-center mt-8 cursor-pointer">
              <h4 className="text-center">Sign up</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

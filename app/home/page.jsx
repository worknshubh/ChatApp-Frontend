"use client";

import { useState } from "react";
import Message from "../../components/message";
import UserCard from "../../components/usercard";
import { useEffect } from "react";
import socket from "../socket";
import HeaderBar from "../../components/header";
export default function HomePage() {
  const [isEmpty, setisEmpty] = useState(true);
  const [listUsers, setlistUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setchatHistory] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [searchedUser, setSearchedUser] = useState("");
  const [searchedUserData, setSearchedUserData] = useState(null);
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setchatHistory((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  async function fetchChatRoom(user) {
    socket.emit("leaveChat", currentRoom);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chats/create/${user._id}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    const output = await res.json();
    console.log(output);
    if (output.success === true) {
      const nextRoom = output.chatRoom._id;

      socket.emit("joinChat", nextRoom);
      console.log("joining room", nextRoom);

      setCurrentRoom(nextRoom);
      setchatHistory([]);

      const loadMessages = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chats/fetch-history`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            chatRoomId: output.chatRoom._id,
          }),
        },
      );

      const chathistory = await loadMessages.json();
      console.log(chathistory);
      if (chathistory.success === true) {
        setchatHistory(chathistory.chatHistory);
      }
    }
  }
  async function checkforRoomandsendMessage() {
    if (!userMessage || !currentRoom) return;

    const sendMsg = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chats/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          chatRoomId: currentRoom,
          userMessage,
        }),
      },
    );

    const msgupdate = await sendMsg.json();

    if (msgupdate.success === true) {
      setchatHistory((prev) => [...prev, msgupdate.msgData]);

      socket.emit("sendMessage", {
        chatId: currentRoom,
        message: msgupdate.msgData,
      });

      setUserMessage("");
    }
  }

  async function fetchUsers() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/list-users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    const output = await res.json();
    if (output.success === true) {
      setlistUsers(output.usersList);
      console.log(output.usersList);
    }
  }

  async function searchUser() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        userEmail: searchedUser,
      }),
    });

    const output = await res.json();
    console.log(output);
    if (output.success === true) {
      setSearchedUserData(output.user);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <div className="w-full fixed">
        <HeaderBar />
      </div>
      <div className="flex min-h-screen bg-white flex-row w-full pt-20">
        <div className="min-h-full w-[20%] border-2 border-[#aaa]]">
          <div className=" h-20 w-full justify-center items-center flex flex-col p-2 bg-white">
            {/* search user  */}
            <div className="border-2 border-blue-400 h-12 w-90 rounded-3xl fixed bg-white">
              <input
                type="text"
                name="userSearch"
                id="userSearch"
                placeholder="Enter User Email to search"
                className="h-12 w-full focus:outline-none text-black p-2"
                value={searchedUser}
                onChange={(el) => {
                  setSearchedUser(el.target.value);
                }}
                onKeyDown={(el) => {
                  if (el.key === "Enter") {
                    searchUser();
                  }
                }}
              />
            </div>
          </div>
          {searchedUser === "" ? (
            listUsers.map((el) => (
              <div
                key={el._id}
                onClick={() => {
                  setisEmpty(false);
                  setActiveUser(el);
                  fetchChatRoom(el);
                }}
              >
                <UserCard username={el.userName} />
              </div>
            ))
          ) : searchedUserData ? (
            <div
              onClick={() => {
                setisEmpty(false);
                setActiveUser(searchedUserData);
                fetchChatRoom(searchedUserData);
              }}
            >
              <UserCard username={searchedUserData.userName} />
            </div>
          ) : (
            <></>
          )}
        </div>
        {/* dynamic content  */}
        {isEmpty === true ? (
          <div className="flex flex-col justify-center items-center w-[80%]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 20 20"
            >
              <path
                fill="#358dfd"
                d="M11 9V5H9v4H5v2h4v4h2v-4h4V9zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20"
              />
            </svg>
            <h2 className="text-black text-3xl mt-5">
              Click on someone profile
            </h2>
            <h2 className="text-xl text-black mt-2">To open the chats</h2>
          </div>
        ) : (
          <div className="flex flex-col w-[80%]">
            {/* header  */}
            <div className="h-20 border-b-2 border-[#aaa] w-full flex flex-col fixed bg-white">
              <div className="flex flex-row justify-start items-center m-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="#358dfd"
                    d="M11 7c0 1.66-1.34 3-3 3S5 8.66 5 7s1.34-3 3-3s3 1.34 3 3"
                  />
                  <path
                    fill="#358dfd"
                    fill-rule="evenodd"
                    d="M16 8c0 4.42-3.58 8-8 8s-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8M4 13.75C4.16 13.484 5.71 11 7.99 11c2.27 0 3.83 2.49 3.99 2.75A6.98 6.98 0 0 0 14.99 8c0-3.87-3.13-7-7-7s-7 3.13-7 7c0 2.38 1.19 4.49 3.01 5.75"
                    clip-rule="evenodd"
                  />
                </svg>

                <h2 className="text-black text-2xl ml-4">
                  {activeUser.userName}
                </h2>
              </div>
            </div>
            {/* body  */}
            <div className=" bg-white w-full overflow-y-auto h-170 mt-20">
              {chatHistory.map((el) => (
                <Message
                  message={el.message}
                  me={
                    el.senderId === localStorage.getItem("userId")
                      ? true
                      : false
                  }
                />
              ))}

              <div className="h-30"></div>
            </div>

            {/* message  */}
            <div className="absolute fixed h-25 w-full bottom-0 flex items-center flex-row z-10 bg-white">
              <div className="m-4 border-2 border-blue-400 rounded-3xl w-[70%] h-17 ">
                <input
                  type="text"
                  name="userMessage"
                  id="userMessage"
                  className="h-full w-full focus:outline-none text-black text-2xl p-2 "
                  placeholder="Type the message"
                  value={userMessage}
                  onChange={(el) => {
                    setUserMessage(el.target.value);
                  }}
                  onKeyDown={(el) => {
                    if (el.key === "Enter") {
                      checkforRoomandsendMessage();
                    }
                  }}
                />
              </div>

              <div
                className="cursor-pointer"
                onClick={checkforRoomandsendMessage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                >
                  <path fill="#358dfd" d="M3 20v-6l8-2l-8-2V4l19 8z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

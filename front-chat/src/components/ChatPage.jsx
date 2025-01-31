import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const stompClientRef = useRef(null); // Using ref for Stomp client....................
// Redirect if not connected.......................
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]);

   // Load messages on page initialization...........................

  useEffect(() => {
    const loadMessages = async () => {
      if (roomId && connected) {
        try {
          const messages = await getMessagess(roomId);
          setMessages(messages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    loadMessages();
  }, [roomId, connected]);

    // Auto scroll down on new messages.........................

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);


 // Connect and subscribe to WebSocket........................
  useEffect(() => {
    if (!connected || !roomId) return;

    const sock = new SockJS(`${baseURL}/chat`);
    const stompClient = Stomp.over(() => sock);

    stompClient.connect({}, () => {
      stompClientRef.current = stompClient;
      toast.success("Connected to WebSocket");

      stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, newMessage]);
      });
    });
     

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
        stompClientRef.current = null;
      }
    };
  }, [roomId, connected]);

    // Handle sending messages....................

  const sendMessage = () => {
    if (stompClientRef.current && connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClientRef.current.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );

      setInput("");
    }
  };
  // Handle logout........................
  const handleLogout = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
    }
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  };

  return (
    <div>
      <header className="dark:border-gray-00 fixed w-full dark:bg-gray-900 py-5 shadow flex justify-around items-center">
        <div>
          <h1 className="text-xl font-semibold">
            Room: <span>{roomId}</span>
          </h1>
        </div>
        <div>
          <h1 className="text-xl font-semibold">
            User: <span>{currentUser}</span>
          </h1>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full"
          >
            Leave Room
          </button>
        </div>
      </header>
       {/* Chat Messages */}
       <main
        ref={chatBoxRef}
        className="py-20 px-10 w-2/3  mx-auto h-screen overflow-auto "
       style={{ backgroundImage: "url('/bannerBg.jpg')" }}
>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`my-2 ${
                message.sender === currentUser ? "bg-green-800" : "bg-gray-800"
              } p-2 max-w-xs rounded`}
            >
              <div className="flex flex-row gap-2">
                <img
                  className="h-10 w-10"
                  src={"https://avatar.iran.liara.run/public/43"}
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold">{message.sender}</p>
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-400">
                    {timeAgo(message.timeStamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      <div className="fixed bottom-4 w-full h-16">
        <div className="h-full pr-10 gap-4 flex items-center justify-between rounded-full w-1/2 mx-auto dark:bg-gray-900">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            type="text"
            placeholder="Type your message here..."
            className="w-full dark:border-gray-600 dark:bg-gray-800 px-5 py-2 rounded-full h-full focus:outline-none"
          />
          <div className="flex gap-1">
            <button className="dark:bg-blue-600 hover:dark:bg-blue-900 h-10 w-10 flex justify-center items-center rounded-full">
              <MdAttachFile size={20} />
            </button>
            <button
              onClick={sendMessage}
              className="dark:bg-green-600 hover:dark:bg-green-900 h-10 w-10 flex justify-center items-center rounded-full"
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

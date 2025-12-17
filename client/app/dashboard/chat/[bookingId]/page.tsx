"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import axios from "axios";
import Button from "@/components/ui/Button";

// --- TYPE DEFINITIONS (UPDATED) ---
interface Message {
  _id?: string;
  booking?: string;
  sender: { _id: string; name?: string; avatar?: string }; // Added avatar
  text: string;
  createdAt: string;
}

// --- HELPER FUNCTIONS & COMPONENTS ---
const getInitials = (name: string = ""): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

// RE-IMPLEMENTED: MessageBubble component with avatar logic
const MessageBubble = ({
  msg,
  isOwnMessage,
}: {
  msg: Message;
  isOwnMessage: boolean;
}) => (
  <div
    className={`flex items-end gap-3 ${
      isOwnMessage ? "justify-end" : "justify-start"
    }`}
  >
    {!isOwnMessage &&
      (msg.sender.avatar ? (
        <img
          src={msg.sender.avatar}
          alt={msg.sender.name || "Avatar"}
          className="flex-shrink-0 w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
          {getInitials(msg.sender.name)}
        </div>
      ))}
    <div
      className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
        isOwnMessage
          ? "bg-sky-500 text-white rounded-br-none"
          : "bg-slate-100 text-slate-800 rounded-bl-none"
      }`}
    >
      <p className="text-sm">{msg.text}</p>
      <p
        className={`text-xs mt-1 ${
          isOwnMessage ? "text-sky-100" : "text-slate-400"
        }`}
      >
        {formatTime(msg.createdAt)}
      </p>
    </div>
  </div>
);

const ChatPageSkeleton = () => (
  <div className="p-4 md:p-8 h-[calc(100vh-64px)] flex flex-col animate-pulse">
    <div className="max-w-4xl mx-auto w-full flex flex-col flex-grow bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 border-b flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-slate-200"></div>
        <div className="w-12 h-12 rounded-full bg-slate-200"></div>
        <div className="h-5 w-32 bg-slate-200 rounded"></div>
      </div>
      <div className="flex-grow p-4 space-y-4">
        <div className="flex items-end gap-3 justify-start">
          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
          <div className="w-2/5 h-16 rounded-2xl bg-slate-200"></div>
        </div>
        <div className="flex items-end gap-3 justify-end">
          <div className="w-1/2 h-20 rounded-2xl bg-slate-200"></div>
        </div>
        <div className="flex items-end gap-3 justify-start">
          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
          <div className="w-1/3 h-12 rounded-2xl bg-slate-200"></div>
        </div>
      </div>
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <div className="h-10 w-full bg-slate-100 rounded-full"></div>
          <div className="h-10 w-24 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function ChatPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { socket } = useSocket();
  const params = useParams();
  const bookingId = params.bookingId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<{
    _id: string;
    name: string;
    avatar?: string;
  } | null>(null); // Updated state
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!session || !socket || !bookingId) return;

    socket.emit("joinRoom", bookingId);

    const fetchMessages = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${session.user.token}` },
        };
        const { data: allBookings } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
          config
        );
        const currentBooking = allBookings.find(
          (b: any) => b._id === bookingId
        );

        if (currentBooking) {
          const participant =
            session.user.role === "mentor"
              ? currentBooking.mentee
              : currentBooking.mentor;
          setOtherUser(participant);
        }

        const { data: messageData } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/${bookingId}`,
          config
        );
        setMessages(messageData);
      } catch (error) {
        console.error("Failed to fetch messages");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();

    const handleReceiveMessage = (data: Message) => {
      if (data.booking === bookingId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [session, socket, bookingId]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newMessage.trim() === "" || !socket || !otherUser) return;

    const messageData = {
      senderId: session!.user.id,
      receiverId: otherUser._id,
      bookingId: bookingId,
      text: newMessage,
    };
    socket.emit("sendMessage", messageData);

    const optimisticMessage: Message = {
      sender: {
        _id: session!.user.id,
        name: session!.user.name || "Me",
        avatar: (session!.user as any).avatar, // Include avatar from session
      },
      text: newMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) return <ChatPageSkeleton />;

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-grow bg-white rounded-xl shadow-lg">
        <div className="p-4 border-b flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-white rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {otherUser?.avatar ? (
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xl">
              {getInitials(otherUser?.name)}
            </div>
          )}

          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {otherUser?.name || "Chat"}
            </h1>
          </div>
        </div>

        <div className="flex-grow p-4 overflow-y-auto bg-slate-50">
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <MessageBubble
                  key={msg._id || index}
                  msg={msg}
                  isOwnMessage={msg.sender._id === session?.user.id}
                />
              ))
            ) : (
              <div className="text-center text-slate-400 mt-8">
                <p>This is the beginning of your conversation.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <Button type="submit" className="rounded-full">
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

import {
  createChatMessage,
  deleteChatMessage,
  getChatsMessages,
} from "@/src/lib/requests";
import { useAuthStore } from "@/src/stores/authStore";
import { useChatStore } from "@/src/stores/chatStore";
import {
  MarkMessageAsSeenEvent,
  UpdateMessageEvent,
} from "@/src/types/Message";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { socket } from "../Layouts/Providers";
import dayjs from "dayjs";
import Header from "./Header";
import { ScaleLoader } from "react-spinners";
import MessageItem from "./MessageItem";
import Footer from "./Footer";

const Chat = () => {
  const {
    chat,
    chats,
    chatMessages,
    loading,
    setLoading,
    setChatMessages,
    setChats,
  } = useChatStore();
  const { user } = useAuthStore();

  const bodyMessageRef = useRef<HTMLDivElement>(null);
  const messages = chatMessages ?? [];

  const handleGetMessages = async () => {
    if (!chat) return;

    setLoading(true);
    const response = await getChatsMessages(chat.id);
    setLoading(false);

    if (response.error || !response.data) {
      toast.error("Error getting messages", { position: "top-center" });
      return;
    }

    setChatMessages(response.data.messages);
  };

  const handleSendMessage = async ({
    text,
    attachment,
    audio,
  }: {
    text?: string;
    attachment?: File | null;
    audio?: Blob | null;
  }) => {
    if (!chat) return;

    const formData = new FormData();

    if (attachment) formData.append("file", attachment);
    if (audio) formData.append("audio", audio);
    if (text) formData.append("body", text);

    const response = await createChatMessage(chat.id, formData);

    if (response.error || !response.data) {
      toast.error(response.error.message, { position: "top-center" });
      return;
    }

    const nextMessages = [...messages, response.data.message];
    setChatMessages(nextMessages);
    setChats(
      chats?.map((item) =>
        item.id === chat.id
          ? {
              ...item,
              last_message: response.data.message,
              viewed_at: response.data.message.created_at,
            }
          : item,
      ) ?? null,
    );
  };

  const handleDeleteMessage = async (message_id: number) => {
    if (!chat) return;

    const response = await deleteChatMessage(chat.id, message_id);

    if (response.error || !response.data) {
      toast.error("Error deleting message.", { position: "top-center" });
      return;
    }

    const nextMessages = messages.filter((message) => message.id !== message_id);
    setChatMessages(nextMessages);
    const lastMessage = nextMessages.at(-1) ?? null;

    setChats(
      chats?.map((item) =>
        item.id === chat.id
          ? {
              ...item,
              last_message: lastMessage,
            }
          : item,
      ) ?? null,
    );
  };

  const scrollToBottom = () => {
    bodyMessageRef.current?.scrollIntoView(false);
  };

  useEffect(() => {
    if (!chat?.id) {
      setChatMessages(null);
      return;
    }

    handleGetMessages();
  }, [chat?.id]);

  useEffect(() => {
    if (chatMessages && chatMessages.length > 0) {
      scrollToBottom();
    }

    const handleUpdateMessage = (data: UpdateMessageEvent) => {
      if (chatMessages && data.query.chat_id === chat?.id) {
        switch (data.type) {
          case "create":
            if (data.messsage)
              setChatMessages([...chatMessages, data.messsage]);
            break;
          case "delete":
            setChatMessages(
              chatMessages.filter(
                (message) => message.id !== data.query.message_id,
              ),
            );
        }
        if (data.messsage && data.messsage.from_user.id !== user?.id) {
          socket.emit("update_messages_as_seen", {
            chat_id: chat.id,
            exclude_user_id: user?.id,
          });
        }
      }
    };
    const handleMarkMessageAsSeen = (data: MarkMessageAsSeenEvent) => {
      if (
        chatMessages &&
        data.query.chat_id === chat?.id &&
        data.query.exclude_user_id !== user?.id
      ) {
        const updatedMessages = chatMessages.map((message) => {
          if (message.viewed_at) return message;
          return {
            ...message,
            viewed_at: dayjs().toISOString(),
          };
        });
        setChatMessages(updatedMessages);
      }
    };
    socket.on("update_chat_message", handleUpdateMessage);
    socket.on("mark_messages_as_seen", handleMarkMessageAsSeen);

    return () => {
      socket.off("update_chat_message", handleUpdateMessage);
      socket.off("mark_messages_as_seen", handleMarkMessageAsSeen);
    };
  }, [chatMessages]);

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <ScaleLoader color="#493cdd" />
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-8 p-7" ref={bodyMessageRef}>
            {messages.map((data) => (
              <div
                key={data.id}
                className={`flex ${data.from_user.id === user?.id ? "justify-end" : "justify-start"}`}
              >
                <MessageItem data={data} onDelete={handleDeleteMessage} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            No messages in this conversation yet.
          </div>
        )}
      </div>
      <Footer onSendMessage={handleSendMessage} />
    </div>
  );
};
export default Chat;

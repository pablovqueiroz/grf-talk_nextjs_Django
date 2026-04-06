import { getChats } from "@/src/lib/requests";
import { useAuthStore } from "@/src/stores/authStore";
import { useChatStore } from "@/src/stores/chatStore";
import { updateChatEvent } from "@/src/types/Chat";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { socket } from "../Providers";
import NewChat from "./NewChat";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { CheckCheck, FileText, Mic, Plus, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import dayjs from "dayjs";
import { truncate } from "fs";
import { Badge } from "../../ui/badge";

type Props = {
  variant?: "mobile" | "desktop";
};

const LeftSide = ({ variant = "desktop" }: Props) => {
  const {
    chat: currentChat,
    chats,
    setChats,
    setChat,
    setShowNewChat,
  } = useChatStore();

  const { user } = useAuthStore();

  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");

  const handleGetChats = async () => {
    const response = await getChats();

    if (response.data) {
      setChats(response.data.chats);
    }
  };

  useEffect(() => {
    handleGetChats();
  }, []);

  const chatsFiltered = chats
    ? query.trim()
      ? chats.filter((chat) =>
          chat.user.name.toLowerCase().includes(query.toLowerCase()),
        )
      : chats
    : [];

  const handleFilterChats = () => {
    setQuery(queryInput);
  };

  useEffect(() => {
    const handleUpdateChat = (data: updateChatEvent) => {
      if (user && data.query.users.includes(user.id)) {
        handleGetChats();
      }

      if (data.type === "delete" && data.query.chat_id === currentChat?.id) {
        setChat(null);
        toast.info("This conversation has been deleted", {
          position: "top-center",
        });
      }
    };
    socket.on("update_chat", handleUpdateChat);

    return () => {
      socket.off("update_chat", handleUpdateChat);
    };
  }, [currentChat]);

  return (
    <div
      className={`bg-slate-100 dark:bg-slate-900 border-r border-slate-50 dark:border-slate-900 ${variant === "mobile" ? "w-auto" : "w-96"} h-app overflow-auto`}
    >
      <NewChat />
      <div className="px-3 py-1 sticky top-0 w-full z-20 bg-slate-100 dark:bg-slate-900">
        <div className="flex gap-2 items-center my-5">
          <Input
            type="search"
            placeholder="Search for chats"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilterChats()}
          />
          <Button variant="outline" onClick={handleFilterChats}>
            <Search className="size-4" strokeWidth={3} />
          </Button>
        </div>

        <Button
          size="sm"
          className="text-slate-100 gap-2 w-full"
          onClick={() => setShowNewChat(true)}
        >
          <Plus className="size-5" />
          <span className="text-sm"> New Chat</span>
        </Button>
      </div>

      <div className="mt-5">
        {chatsFiltered.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center gap-4 py-4 px-3 ${chat.id === currentChat?.id ? "bg-slate-200 dark:bg-slate-800" : ""} hover:bg-slate-200 hover:dark: bg-slate-700 cursor-pointer transition`}
            onClick={() => setChat(chat)}
          >
            <Avatar
              className="size-[46px]"
              isOnline={dayjs()
                .subtract(5, "minutes")
                .isBefore(dayjs(chat.user.last_access))}
            >
              <AvatarImage src={chat.user.avatar} alt={chat.user.name} />
              <AvatarFallback>{chat.user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>

            <div className="space-y-1 flex-1 truncate">
              <div className="flex items-center justify-between gap-4">
                <div className="font-bold text-slate-800 dark:text-slate-100 truncate text-ellipsis">
                  {chat.user.name}
                </div>
                <div className="text-sm font-semibold  text-gray-500 dark:text-gray-400">
                  {dayjs(chat.viewed_at || chat.created_at).format(
                    "DD/MM/YYYY",
                  )}
                </div>
              </div>
              {chat.last_message ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-300 truncate text-ellipsis">
                    {chat.last_message.body ? (
                      chat.last_message.body
                    ) : chat.last_message.attachment?.audio ? (
                      <div className="flex items-center gap-1">
                        <Mic className="size-4 mb-0.5" strokeWidth={2} />
                        Voice message
                      </div>
                    ) : chat.last_message.attachment?.file ? (
                      <div className="flex items-center gap-1">
                        <FileText className="size-4 mb-0.5" strokeWidth={2} />
                        File
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {chat.unseen_count > 0 ? (
                    <Badge>{chat.unseen_count}</Badge>
                  ) : (
                    chat.last_message.from_user.id == user?.id && (
                      <div
                        className={
                          chat.last_message.viewed_at
                            ? "text-emerald-600 dark:text-emeral-400"
                            : "text-slate-800 dark:text-slate-300"
                        }
                      >
                        <CheckCheck className="size-5" strokeWidth={2} />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-300 truncate text-ellipsis">
                  {" "}
                  Click to send a message
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSide;

"use client";

import { deleteChat } from "@/src/lib/requests";
import { useChatStore } from "@/src/stores/chatStore";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { EllipsisVertical, Trash2 } from "lucide-react";

const Header = () => {
  const { chat, chats, setChat, setChatMessages, setChats, setLoading } =
    useChatStore();

  const userIsOnline = dayjs()
    .subtract(5, "minutes")
    .isBefore(
      dayjs(chats?.find((item) => item.id === chat?.id)?.user.last_access),
    );

  const handleDeleteChat = async () => {
    if (!chat) return;

    setLoading(true);
    const response = await deleteChat(chat.id);
    setLoading(false);

    if (response.error || !response.data?.success) {
      return;
    }

    setChats(chats?.filter((item) => item.id !== chat.id) ?? null);
    setChatMessages(null);
    setChat(null);
  };

  return (
    <div className="flex items-center gap-6 border-b bg-slate-100/80 dark:bg-slate-900/80 px-8 pr-12 h-16">
      <Avatar className="size-11" isOnline={userIsOnline}>
        <AvatarImage src={chat?.user.avatar} alt={chat?.user.name} />
        <AvatarFallback>{chat?.user.name.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h1 className="font-bold text-ellipsis truncate max-w-96">
          {chat?.user.name}
        </h1>
        <small className="text-slate-500 dark:text-slate-400 block mt-0.5">
          {userIsOnline
            ? "Online"
            : `Last seen ${dayjs(chats?.find((item) => item.id === chat?.id)?.user.last_access).format("DD/MM/YYYY [at] HH:mm")}`}
        </small>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer text-slate-500 dark:text-slate-400"
            aria-label="Open chat actions"
          >
            <EllipsisVertical className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleDeleteChat}
          >
            <Trash2 className="mr-2 size-4" />
            <span>Delete chat</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default Header;

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ChevronDown, Home, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { toast } from "sonner";

import Logo from "@/src/assets/logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { handleSignOut } from "@/src/lib/server/auth-actions";
import { useAuthStore } from "@/src/stores/authStore";
import { useChatStore } from "@/src/stores/chatStore";

const getUserInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const Header = () => {
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const { user, clearUser } = useAuthStore();
  const { setChat, showChatsList, setShowChatsList } = useChatStore();

  const handleLogout = async () => {
    setChat(null);
    clearUser();
    toast.success("Successfully logged out.", { position: "top-center" });
    await handleSignOut();
  };

  return (
    <header className="h-header border-b border-slate-200 bg-slate-100 px-2 dark:border-slate-800 dark:bg-slate-900">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <div className="hidden min-[480px]:block">
          <Link href="/">
            <Image src={Logo} alt="Logo GRF Talk" width={170} priority />
          </Link>
        </div>

        <Button className="flex min-[480px]:hidden" variant="outline" size="icon" asChild>
          <Link href="/">
            <Home className="size-5" />
            <span className="sr-only">Go to home</span>
          </Link>
        </Button>

        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            className="flex lg:hidden"
            variant="outline"
            size="icon"
            onClick={() => setShowChatsList(!showChatsList)}
          >
            <Menu className="size-5" />
            <span className="sr-only">Open or close chats</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-3 px-2 sm:px-3">
                  <Avatar className="size-7">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    className="size-4 text-slate-500 dark:text-slate-300"
                    strokeWidth={2.5}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-3 size-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
                  <LogOut className="mr-3 size-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {!user && pathname.startsWith("/auth") ? (
            pathname !== "/auth/signin" ? (
              <Button size="sm" asChild>
                <Link href="/auth/signin">Login</Link>
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            )
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Header;

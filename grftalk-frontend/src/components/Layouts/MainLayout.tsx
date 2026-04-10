"use client";

import { useAuthStore } from "@/src/stores/authStore";
import { useChatStore } from "@/src/stores/chatStore";
import { User } from "@/src/types/User";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";
import LeftSide from "./LeftSide";
import { Sheet, SheetContent, SheetTitle } from "@/src/components/ui/sheet";
import { VisuallyHidden } from "radix-ui";

type Props = {
  user: User | null;
  children: React.ReactNode;
};

const MainLayout = ({ user, children }: Props) => {
  const { user: authUser, setUser } = useAuthStore();
  const { showChatsList, setShowChatsList } = useChatStore();

  const pathname = usePathname();

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
      <Header />

      {authUser && !pathname.includes("auth") ? (
        <div className="flex h-full">
          <div className="hidden lg:block">
            <LeftSide />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      ) : (
        <div className="flex-1">{children}</div>
      )}

      <Sheet open={showChatsList} onOpenChange={setShowChatsList}>
        <SheetContent className="p-0 bg-slate-100 dark:bg-slate-900">
          <VisuallyHidden.Root>
            <SheetTitle>Navegação</SheetTitle>
          </VisuallyHidden.Root>
          <LeftSide variant="mobile" />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MainLayout;

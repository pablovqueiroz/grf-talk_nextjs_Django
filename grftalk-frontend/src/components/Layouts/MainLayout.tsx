"use client";

import { useAuthStore } from "@/src/stores/authStore";
import { useChatStore } from "@/src/stores/chatStore";
import { User } from "@/src/types/User";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";
import { BarLoader } from "react-spinners";
import LeftSide from "./LeftSide";
import { Sheet, SheetContent } from "@/src/components/ui/sheet";

type Props = {
  user: User | null;
  children: React.ReactNode;
};

const MainLayout = ({ user, children }: Props) => {
  const auth = useAuthStore();
  const { showChatsList, setShowChatsList } = useChatStore();

  const [loading, setLoading] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const initialize = async () => {
      if (user) auth.setUser(user);
      setLoading(false);
    };

    initialize();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate- dark:bd-slate-950">
      <Header />
      {loading && (
        <div className="flex items-center justify-center h-full">
          <BarLoader color="#493cdd" />
        </div>
      )}

      {!loading && auth.user && !pathname.includes("auth") ? (
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
          <LeftSide variant="mobile" />
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default MainLayout;

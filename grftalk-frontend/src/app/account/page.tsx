import AccountPage from "@/src/components/Pages/Account";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
};

const Account = () => <AccountPage />;

export default Account;

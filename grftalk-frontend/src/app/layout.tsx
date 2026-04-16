import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Nunito } from "next/font/google";
import "./globals.css";
import { handleGetUser } from "../lib/server/auth";
import { Providers } from "../components/Layouts/Providers";
import MainLayout from "../components/Layouts/MainLayout";

const nunito = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | GRF Talk",
    default: "Home | GRF Talk",
  },
  icons: {
    icon: "/grftalk.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authToken = (await cookies()).get(
    process.env.NEXT_PUBLIC_AUTH_KEY as string,
  )?.value;
  const user = await handleGetUser(authToken);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={nunito.className}>
        <Providers>
          <MainLayout user={user}>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}

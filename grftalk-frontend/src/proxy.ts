import { NextRequest, NextResponse } from "next/server";
import { handleGetUser } from "./lib/server/auth";

export async function proxy(request: NextRequest) {
  const authToken = request.cookies.get(
    process.env.NEXT_PUBLIC_AUTH_KEY as string,
  )?.value;
  const user = await handleGetUser(authToken);

  if (!request.nextUrl.pathname.startsWith("/auth") && !user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/auth") && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/((?!.*\\..*|_next).*)",
};

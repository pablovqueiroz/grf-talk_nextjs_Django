import { NextRequest, NextResponse } from "next/server";
import { handleGetUser } from "./lib/server/auth";

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get(
    process.env.NEXT_PUBLIC_AUTH_KEY as string,
  )?.value;
  const user = await handleGetUser(authToken);

  /* Redirect to signin if user is not authenticated */
  if (!request.nextUrl.pathname.startsWith("/auth") && !user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  /* Redirect to home if is authenticated */
  if (request.nextUrl.pathname.startsWith("/auth") && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/((?!.*\\..*|_next).*)",
};

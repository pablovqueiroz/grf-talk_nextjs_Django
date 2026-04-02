import { NextRequest, NextResponse } from "next/server";
import { handleGetUser } from "./server/auth";

export async function middlewate(request: NextRequest) {
  const user = await handleGetUser();

  //Redirect to signin if user is not authenticated
  if (!request.nextUrl.pathname.startsWith("/auth") && !user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  //Redirect to home if is authenticated
  if (request.nextUrl.pathname.startsWith("/auth") && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/((?!.*\\..*|_next).*)",
};

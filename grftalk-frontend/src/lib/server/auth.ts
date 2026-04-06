import "server-only";

import { User } from "@/src/types/User";

export const handleGetUser = async (authToken?: string | null) => {
  if (!authToken) return null;

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1/accounts/me",
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) return null;

  const jsonResponse = await response.json();
  const userData = jsonResponse.user;

  if (userData) return userData as User;

  return null;
};

"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useMemo } from "react";
import { getAllUsersOnline } from "./online.actions";

interface CustomUserOnline {
  id: string;
  avatar: string | null;
  username: string;
}

export default function CardOnline() {
  const { data: users = [] } = useQuery<CustomUserOnline[]>({
    queryKey: ["usersOnline"],
    queryFn: getAllUsersOnline,
    staleTime: 1000 * 60 * 1,
  });

  const userCount = useMemo(() => users.length, [users]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-800 text-white p-4">
        <h2 className="text-lg font-semibold">
          Membres en ligne ({userCount})
        </h2>
      </div>
      <div className="p-4 space-y-3">
        {users.map((user: CustomUserOnline) => (
          <div key={user.id} className="flex items-center gap-3">
            <Image
              src={
                `/api/avatars/${user.avatar}` ||
                "/uploads/images/avatars/v0_57.png"
              }
              alt={user.username}
              width={32}
              height={32}
              className="rounded-full"
              style={{ width: "32px", height: "32px" }}
            />
            <span className="text-gray-700">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

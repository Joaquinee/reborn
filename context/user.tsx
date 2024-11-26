"use client";

import type { User } from "next-auth";
import type { Dispatch, SetStateAction } from "react";

import { createContext, useContext } from "react";

export const UserContext = createContext({
  user: undefined as User | undefined,
  setUser: (() => {}) as Dispatch<SetStateAction<User | undefined>>,
});
UserContext.displayName = "UserContext";

export const useUserContext = () => useContext(UserContext);

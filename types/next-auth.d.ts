 import NextAuth from "next-auth";
import { UserRole, UserStatus, AuthProvider } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: UserRole;
      status?: UserStatus;
      isApproved?: boolean;
      authProvider?: AuthProvider;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    status?: UserStatus;
    isApproved?: boolean;
    authProvider?: AuthProvider;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    status?: UserStatus;
    isApproved?: boolean;
    authProvider?: AuthProvider;
  }
}

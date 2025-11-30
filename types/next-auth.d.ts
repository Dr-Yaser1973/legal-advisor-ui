
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    role: "ADMIN" | "LAWYER" | "CLIENT";
  }
  interface Session {
    user: {
      id: number;
      email?: string | null;
      name?: string | null;
      role: "ADMIN" | "LAWYER" | "CLIENT";
    };
  }
}

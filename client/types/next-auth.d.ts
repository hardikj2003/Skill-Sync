import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      token: string;
      avatar?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    token: string;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    token: string; // Changed from backendToken to match User interface
    avatar?: string;
  }
}

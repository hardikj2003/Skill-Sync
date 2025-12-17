import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter your email and password");
        }

        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;
          const { data } = await axios.post(apiUrl, {
            email: credentials.email,
            password: credentials.password,
          });

          if (data) {
            // Return an object that matches the 'User' interface we defined
            return {
              id: data._id, // Map MongoDB _id to NextAuth id
              name: data.name,
              email: data.email,
              role: data.role,
              token: data.token,
              avatar: data.avatar,
            };
          }
          return null;
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "Invalid credentials"
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      return true;
    },
    async jwt({ token, user, account }) {
      // 1. Handle Initial Sign In (Both Google and Credentials land here first)
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.token = user.token; // Now consistent
        token.avatar = user.avatar;

        if (account?.provider === "google") {
          try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
            const { data: backendUser } = await axios.post(apiUrl, {
              name: user.name,
              email: user.email,
              googleId: account.providerAccountId, // Use providerAccountId for stability
              image: user.image,
            });

            // Update the token with data from YOUR backend
            token.id = backendUser._id;
            token.role = backendUser.role;
            token.token = backendUser.token;
          } catch (error) {
            console.error("Error syncing Google user with backend:", error);
            // Optionally throw error to block login if backend fails
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the data from the token to the client-side session
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.token = token.token; // Fixed variable name inconsistency
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

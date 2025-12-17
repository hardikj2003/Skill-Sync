import NextAuth from "next-auth";
import { authOptions } from "@/app/utils/auth"; // Make sure this path points to where you created the file in Step 1

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import { type DefaultSession } from "next-auth";

export const authConfig = {
  trustHosts: true,
  pages: {
    signIn: "/user/login",
    error: "/user/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return `${baseUrl}/user/home`;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "user";
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
};

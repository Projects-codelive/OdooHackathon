import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { verifyPassword } from "@/lib/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: ["none"],
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      checks: ["none"],
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        expectedRole: { label: "Expected Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isValid) {
          return null;
        }

        // Validate that the user is logging into the correct portal
        if (credentials.expectedRole) {
          if (user.role !== credentials.expectedRole) {
            throw new Error(`Access denied. You are a ${user.role}, please use the correct login portal.`);
          }
        }

        return user as any;
      },
    }),
  ],
  events: {
    async signIn(message) { console.log("SIGNIN EVENT:", message) },
    async createUser(message) { console.log("USER CREATED:", message) },
    async linkAccount(message) { console.log("ACCOUNT LINKED:", message) },
  },
});

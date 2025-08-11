import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
// import Credentials from "next-auth/providers/credentials";
// import { signInEmailPassword } from '@/auth/auth-actions';
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Github({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Correo electrónico", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        if(!bcrypt.compareSync(password, user.password ?? "")) return null;
        return user || null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email ?? "" },
      });
      token.roles = dbUser?.roles ?? ["no-roles"];
      token.id = dbUser?.id ?? "no-uuid";
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.roles = token.roles;
      }
      return session;
    },
  },
};

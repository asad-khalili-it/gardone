import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: "super_admin" | "store_owner";
    storeId?: number;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "super_admin" | "store_owner";
      storeId?: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: "super_admin" | "store_owner";
    storeId?: number;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "ایمیل", type: "email" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("ایمیل و رمز عبور الزامی است");
        }

        // First check Admin table
        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (admin) {
          const isValid = await bcrypt.compare(credentials.password, admin.password);
          if (!isValid) {
            throw new Error("ایمیل یا رمز عبور اشتباه است");
          }
          return {
            id: String(admin.id),
            email: admin.email,
            name: admin.name,
            role: admin.role as "super_admin",
          };
        }

        // Then check Store table (store owner)
        const store = await prisma.store.findUnique({
          where: { ownerEmail: credentials.email },
        });

        if (store) {
          const isValid = await bcrypt.compare(credentials.password, store.ownerPassword);
          if (!isValid) {
            throw new Error("ایمیل یا رمز عبور اشتباه است");
          }
          if (!store.isActive) {
            throw new Error("فروشگاه شما غیرفعال شده است");
          }
          return {
            id: String(store.id),
            email: store.ownerEmail,
            name: store.ownerName,
            role: "store_owner" as const,
            storeId: store.id,
          };
        }

        throw new Error("ایمیل یا رمز عبور اشتباه است");
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.storeId = user.storeId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        storeId: token.storeId,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

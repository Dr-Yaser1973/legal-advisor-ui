 // lib/auth.ts

import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// نستخدم any هنا لتفادي مشكلة نوع NextAuthOptions بين الإصدارات
export const authOptions: any = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // جلب المستخدم من قاعدة البيانات
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        // نرجّع الدور role مع بيانات المستخدم
        return {
          id: user.id.toString(),
          name: user.name ?? "",
          email: user.email ?? "",
          role: user.role, // UserRole من Prisma (ADMIN / LAWYER / CLIENT)
        };
      },
    }),
  ],

  callbacks: {
    // أول مرة نسجل الدخول ننسخ الدور من user إلى token
    async jwt({
      token,
      user,
    }: {
      token: any;
      user?: any;
    }): Promise<any> {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    // في كل طلب ننسخ الدور من token إلى session.user
    async session({
      session,
      token,
    }: {
      session: any;
      token: any;
    }): Promise<any> {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

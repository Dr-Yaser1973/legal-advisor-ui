 // app/api/auth/[...nextauth]/route.ts
// نلغي فحص التايبز في هذا الملف حتى لا يزعجنا TypeScript
// @ts-nocheck

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// خيارات NextAuth
export const authOptions = {
  // نستخدم JWT بدل تخزين الجلسة في قاعدة البيانات
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // دالة التحقق عند محاولة تسجيل الدخول
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البيانات غير مكتملة");
        }

        // البحث عن المستخدم في قاعدة البيانات
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("البريد أو كلمة المرور غير صحيحة");
        }

        // مقارنة كلمة المرور المدخلة مع الـ hash المخزَّن
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) {
          throw new Error("البريد أو كلمة المرور غير صحيحة");
        }

        // إرجاع بيانات المستخدم التي ستُخزن في الـ JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // ADMIN | LAWYER | CLIENT | COMPANY | TRANSLATION_OFFICE
        };
      },
    }),
  ],

  // callbacks للتحكم في الـ JWT والـ session
  callbacks: {
    async jwt({ token, user }) {
      // أول مرة (وقت تسجيل الدخول) ننسخ بيانات المستخدم إلى التوكن
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // نجعل بيانات الـ token متاحة داخل session.user
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  // صفحة تسجيل الدخول المخصصة
  pages: {
    signIn: "/login",
  },

  // السر المستخدم لتشفير الـ JWT
  secret: process.env.NEXTAUTH_SECRET,
};

// هاندلر NextAuth لـ GET و POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

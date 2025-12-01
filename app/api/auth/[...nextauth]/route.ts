 // app/api/auth/[...nextauth]/route.ts

// نوقف فحص التايبز
// @ts-nocheck
export const runtime = "nodejs";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// شكل المستخدم الذي سنضعه في التوكن
type AppUser = {
  id: number;
  email: string | null;
  name: string | null;
  role: string; // ADMIN | LAWYER | ...
};

// خيارات NextAuth
export const authOptions = {
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

      // ✅ هنا الباب الخلفي للأدمن فقط، بدون قاعدة بيانات
      async authorize(credentials): Promise<AppUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // نقرأ بيانات الأدمن من متغيرات البيئة
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // لو الإيميل والباسورد مطابقين للقيم الموجودة في الـ ENV → دخول كأدمن
        if (
          adminEmail &&
          adminPassword &&
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          return {
            id: 1,
            email: adminEmail,
            name: "Platform Admin",
            role: "ADMIN",
          };
        }

        // ❌ أي مستخدم آخر نرفضه (إلى أن نرجع لاحقًا لنظام التسجيل)
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
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

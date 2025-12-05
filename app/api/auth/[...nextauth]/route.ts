 // app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login", // صفحة تسجيل الدخول المخصصة
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("يرجى إدخال البريد وكلمة المرور.");
        }

        const email = credentials.email.trim().toLowerCase();
        const plainPassword = credentials.password;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("البريد غير مسجل.");
        }

        if (!user.password) {
          throw new Error("لا توجد كلمة مرور محفوظة لهذا الحساب.");
        }

        // 🔐 التحقق من كلمة المرور
        const isValid = await bcrypt.compare(plainPassword, user.password);
        if (!isValid) {
          throw new Error("كلمة المرور غير صحيحة.");
        }

        // اختياري: منع المستخدمين غير الفعّالين
        if (user.status && user.status !== "ACTIVE") {
          throw new Error("الحساب غير مفعّل، يرجى مراجعة إدارة المنصة.");
        }

        return {
          id: user.id.toString(),
          name: user.name ?? "",
          email: user.email ?? "",
          role: user.role,
          status: user.status,
          isApproved: user.isApproved,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.status = (user as any).status;
        token.isApproved = (user as any).isApproved;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).status = token.status;
        (session.user as any).isApproved = token.isApproved;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

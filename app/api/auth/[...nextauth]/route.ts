 // app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// شكل المستخدم الذي نعيده لـ JWT
type AppUser = {
  id: number;
  email: string | null;
  name: string | null;
  role: string;   // ADMIN | LAWYER | CLIENT | COMPANY | TRANSLATION_OFFICE
  status: string | null; // ACTIVE | BLOCKED
};

export const authOptions: any = {
  session: {
    strategy: "jwt" as const,
  },

  providers: [
    // 👈 نكسر التايبز الثقيلة هنا
    (CredentialsProvider as any)({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // 👈 نستخدم any لتفادي مشاكل التايبز
      async authorize(credentials: any): Promise<AppUser | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        // 🔒 منع المستخدم المحظور
        // @ts-ignore: Prisma enum vs string literal
        if (user.status === "BLOCKED") return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          // @ts-ignore: حقل role موجود في prisma user
          role: user.role,
          // @ts-ignore: status enum → نعطيه قيمة نصية
          status: user.status ?? "ACTIVE",
        };
      },
    }),
  ],

  callbacks: {
    // نعتمد any هنا لتفادي مشاكل User | AdapterUser
    async jwt({ token, user }: any) {
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.role = u.role;
        token.status = u.status;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).status = token.status;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// هاندلر الأوث
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

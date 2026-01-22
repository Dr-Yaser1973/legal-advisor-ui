 import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AuthProvider, UserRole, UserStatus } from "@prisma/client";

export const runtime = "nodejs";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  providers: [
    // =========================
    // CREDENTIALS LOGIN
    // =========================
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
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
          throw new Error("هذا الحساب مسجل عبر Google. استخدم زر Google للدخول.");
        }

        const isValid = await bcrypt.compare(plainPassword, user.password);
        if (!isValid) {
          throw new Error("كلمة المرور غير صحيحة.");
        }

        if (user.status !== UserStatus.ACTIVE) {
          throw new Error("الحساب غير مفعّل، يرجى مراجعة إدارة المنصة.");
        }

        // ⚠️ فقط الهوية — لا تضف حقول أخرى هنا
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),

    // =========================
    // GOOGLE LOGIN
    // =========================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],

  callbacks: {
    // =========================
    // LINK GOOGLE TO DB USER
    // =========================
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const providerId = account.providerAccountId;

        const existing = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existing) {
          if (!existing.providerId) {
            await prisma.user.update({
              where: { id: existing.id },
              data: {
                providerId,
                authProvider: AuthProvider.GOOGLE,
                image: user.image,
                emailVerified: new Date(),
              },
            });
          }
        } else {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              providerId,
              authProvider: AuthProvider.GOOGLE,
              role: UserRole.CLIENT,
              status: UserStatus.ACTIVE,
              isApproved: true,
              emailVerified: new Date(),
            },
          });
        }
      }

      return true;
    },

    // =========================
    // JWT — LOAD DB USER DATA
    // =========================
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            role: true,
            status: true,
            isApproved: true,
            authProvider: true,
          },
        });

        token.role = dbUser?.role;
        token.status = dbUser?.status;
        token.isApproved = dbUser?.isApproved;
        token.authProvider = dbUser?.authProvider;
      }

      return token;
    },

    // =========================
    // SESSION — EXPOSE TO UI
    // =========================
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).status = token.status;
        (session.user as any).isApproved = token.isApproved;
        (session.user as any).authProvider = token.authProvider;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

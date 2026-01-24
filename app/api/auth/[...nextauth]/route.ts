 import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AuthProvider, UserRole, UserStatus } from "@prisma/client";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

// =======================
// PRODUCTION DOMAIN
// =======================
const PROD_DOMAIN = "legal-advisor-ui.vercel.app";

// =======================
// GOOGLE PREVIEW BLOCK
// =======================
function assertGoogleAllowed(req: NextRequest) {
  const host = req.headers.get("host") || "";

  const isPreview =
    host.endsWith("vercel.app") && host !== PROD_DOMAIN;

  if (isPreview) {
    throw new Error(
      "Google OAuth is disabled on preview domains. Use production site."
    );
  }
}

// =======================
// AUTH OPTIONS
// =======================
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
    // JWT
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

        if (dbUser) {
          (token as any).role = dbUser.role;
          (token as any).status = dbUser.status;
          (token as any).isApproved = dbUser.isApproved;
          (token as any).authProvider = dbUser.authProvider;
        }
      }

      return token;
    },

    // =========================
    // SESSION
    // =========================
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role;
        (session.user as any).status = (token as any).status;
        (session.user as any).isApproved = (token as any).isApproved;
        (session.user as any).authProvider = (token as any).authProvider;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// =======================
// HANDLER
// =======================
const handler = NextAuth(authOptions);

// =======================
// ROUTES
// =======================
export async function GET(req: NextRequest) {
  try {
    const provider = req.nextUrl.searchParams.get("provider");

    if (provider === "google") {
      assertGoogleAllowed(req);
    }

    return handler(req);
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message || "Auth blocked" }),
      { status: 403, headers: { "content-type": "application/json" } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const provider = req.nextUrl.searchParams.get("provider");

    if (provider === "google") {
      assertGoogleAllowed(req);
    }

    return handler(req);
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message || "Auth blocked" }),
      { status: 403, headers: { "content-type": "application/json" } }
    );
  }
}

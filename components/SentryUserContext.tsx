 "use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import * as Sentry from "@sentry/nextjs";

export default function SentryUserContext() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      Sentry.setUser({
        id: (session.user as { id?: string }).id,
        role: (session.user as { role?: string }).role,
      } as Sentry.User);
    } else if (status === "unauthenticated") {
      Sentry.setUser(null);
    }
  }, [session, status]);

  return null;
}
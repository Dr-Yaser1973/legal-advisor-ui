 import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RegisterSmartPage() {
  const h = await headers();
  const ua = h.get("user-agent")?.toLowerCase() || "";

  const isMobile =
    ua.includes("iphone") ||
    ua.includes("android") ||
    ua.includes("ipad");

  redirect(isMobile ? "/mobile-register" : "/register");
}

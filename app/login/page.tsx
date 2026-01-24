 // app/login/page.tsx


export const dynamic = "force-dynamic"; // منع الـ prerender الإجباري

import LoginForm from "./LoginForm";

export default function LoginPage() {
  return <LoginForm />;
}


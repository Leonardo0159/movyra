import { getCurrentUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";

interface AuthCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export async function AuthCheck({
  children,
  redirectTo = "/login",
}: AuthCheckProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}

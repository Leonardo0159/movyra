import { getCurrentUser, getActiveProfile } from "@/lib/auth/actions";
import { AuthProvider } from "@/lib/auth/context";

export async function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const profile = await getActiveProfile();

  return (
    <AuthProvider initialUser={user} initialProfile={profile}>
      {children}
    </AuthProvider>
  );
}

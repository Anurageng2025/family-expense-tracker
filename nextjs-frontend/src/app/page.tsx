"use client";

import { useEffect, useState } from &apos;react&apos;;
import { useRouter } from &apos;next/navigation&apos;;
import { useAuthStore } from &apos;@/store/authStore&apos;;

export default function Home() {
  const router = useRouter();
  const { initAuth, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initAuth();
    setMounted(true);
  }, [initAuth]);

  useEffect(() => {
    if (mounted) {
      if (isAuthenticated) {
        router.push(&apos;/dashboard&apos;);
      } else {
        router.push(&apos;/login&apos;);
      }
    }
  }, [mounted, isAuthenticated, router]);

  return (
    <div style={{ display: &apos;flex&apos;, justifyContent: &apos;center&apos;, alignItems: &apos;center&apos;, height: &apos;100vh&apos;, background: &apos;#f6f8fd&apos; }}>
      <p style={{ color: &apos;#64748b&apos;, fontFamily: &apos;Inter, sans-serif&apos; }}>Redirecting...</p>
    </div>
  );
}

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col justify-center text-center gap-6 max-w-5xl mx-auto">
      <h1 className="text-5xl font-semibold">Invoice App</h1>
      <p>
        <Button asChild>
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </p>
    </main>
  );
}
